"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Edit3, ExternalLink, Eye, Hash, ImageIcon, Layers, Map, MapPin, Minus, Plus, RotateCcw, Trash2, Upload, X } from "lucide-react";
import type { Entry, WorldMapConfig } from "@/types";
import { ENTRY_TYPE_ICONS, LOCATION_CATEGORY_LABELS } from "@/types";
import { createEmptyLocationProfile } from "@/lib/location-profile";
import { clamp01, formatMapCoordLabel, generateTemporaryLayout, isDefaultMapPosition } from "@/lib/map-coordinates";
import { useStore } from "@/hooks/use-store";
import { TopBar } from "@/components/TopBar";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";

// ── Types & Constants ──────────────────────────────────────
interface WorldMapViewProps { projectId: string }
interface MapLocation { entry: Entry; mapX: number; mapY: number; parentId: string | null; _isTemp?: true }
interface LaidOutLocation extends MapLocation { cx: number; cy: number; labelX: number; labelY: number; labelAnchor: "start" | "middle" | "end"; showCategory: boolean }
interface LabelBox { x: number; y: number; w: number; h: number }
const MIN_ZOOM = 0.75, MAX_ZOOM = 3, ZOOM_STEP = 0.25, DRAG_THRESHOLD = 3;
const MAX_FILE_SIZE = 1.5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

// ── Label Layout ───────────────────────────────────────────
function clamp(v:number,lo:number,hi:number){return Math.max(lo,Math.min(hi,v));}
function estimateLabelBox(x: number, y: number, title: string, hasCat: boolean, anchor: "start"|"middle"|"end"): LabelBox {
  const w = Math.max(3, Array.from(title).length * 1.15), h = hasCat ? 3.2 : 2.0;
  return { x: anchor==="start"? x: anchor==="end"? x-w: x-w/2, y: y-h*0.6, w, h };
}
function boxesOverlap(a: LabelBox, b: LabelBox): boolean { const pad=0.6; return !(a.x+a.w+pad<=b.x||b.x+b.w+pad<=a.x||a.y+a.h+pad<=b.y||b.y+b.h+pad<=a.y); }
const CANDIDATES: { dx: number; dy: number; anchor: "start"|"middle"|"end" }[] = [
  { dx:1.8,dy:-2.4,anchor:"start"},{ dx:-1.8,dy:-2.4,anchor:"end"},{ dx:1.8,dy:2.4,anchor:"start"},{ dx:-1.8,dy:2.4,anchor:"end"},
  { dx:0,dy:-3.2,anchor:"middle"},{ dx:0,dy:3.2,anchor:"middle"},{ dx:2.8,dy:0,anchor:"start"},{ dx:-2.8,dy:0,anchor:"end"},
];
function layoutMapLabels(locs: MapLocation[]): LaidOutLocation[] {
  const sorted=[...locs].sort((a,b)=>a.mapY-b.mapY||a.mapX-b.mapX||a.entry.title.localeCompare(b.entry.title,"zh-CN"));
  const occupied: LabelBox[]=[];
  return sorted.map((loc)=>{
    const cx=loc.mapX*100,cy=loc.mapY*100; const title=loc.entry.title||"未命名地点"; const hasCat=Boolean(loc.entry.locationProfile?.locationCategory);
    let best: { labelX:number;labelY:number;labelAnchor:"start"|"middle"|"end";showCategory:boolean}|null=null;
    for(const showCat of[true,false]){for(const cand of CANDIDATES){const lx=clamp(cx+cand.dx,4,96),ly=clamp(cy+cand.dy,4,96);if(!occupied.some((o)=>boxesOverlap(estimateLabelBox(lx,ly,title,hasCat&&showCat,cand.anchor),o))){best={labelX:lx,labelY:ly,labelAnchor:cand.anchor,showCategory:hasCat&&showCat};break;}}if(best)break;}
    if(!best)best={labelX:clamp(cx+1.8,4,96),labelY:clamp(cy-2.4,4,96),labelAnchor:"start",showCategory:false};
    occupied.push(estimateLabelBox(best.labelX,best.labelY,title,best.showCategory,best.labelAnchor));
    return{...loc,cx,cy,...best};
  });
}

// ── Compass / Relation / Node ──────────────────────────────
function CompassRose(){return(<g fill="none" stroke="#8a7a6a" strokeWidth="0.12" opacity="0.35"><line x1="96" y1="2" x2="96" y2="8"/><line x1="96" y1="2" x2="94" y2="3.5"/><line x1="96" y1="2" x2="98" y2="3.5"/><text x="96" y="9" textAnchor="middle" fill="#8a7a6a" stroke="none" style={{fontSize:"1.2px",fontFamily:"var(--font-noto-serif),serif"}}>北</text></g>);}
function MapRelationLine({parent,child}:{parent:LaidOutLocation;child:LaidOutLocation}){return<path d={`M${parent.cx} ${parent.cy} Q${(parent.cx+child.cx)/2} ${Math.min(parent.cy,child.cy)-1.5} ${child.cx} ${child.cy}`} fill="none" stroke="#c9a44a" strokeWidth="0.22" strokeDasharray="1.2 1.8" strokeLinecap="round" opacity="0.5"/>;}

function MapNode({loc,onClick,isHovered,onHover,showLabel,isSelected,onNodePointerDown}:{
  loc:LaidOutLocation; onClick:(id:string)=>void; isHovered:boolean; onHover:(id:string|null)=>void; showLabel:boolean; isSelected:boolean; onNodePointerDown?:(e:React.PointerEvent,id:string)=>void;
}){
  const p=loc.entry.locationProfile; const catLabel=loc.showCategory&&p?.locationCategory?(LOCATION_CATEGORY_LABELS[p.locationCategory]||p.locationCategory):null;
  const r=isHovered||isSelected?1.6:1.2; const textAttrs={fontFamily:"var(--font-noto-serif),serif",pointerEvents:"none"as const,paintOrder:"stroke"as const,stroke:"#fffcf7",strokeWidth:"0.5"};
  return(<g role="button" tabIndex={0} className="cursor-pointer focus-visible:outline-none"
    onClick={(e)=>{e.stopPropagation();onClick(loc.entry.id);}}
    onKeyDown={(e)=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onClick(loc.entry.id);}}}
    onPointerEnter={()=>onHover(loc.entry.id)} onPointerLeave={()=>onHover(null)}
    onPointerDown={onNodePointerDown?(e)=>{e.stopPropagation();onNodePointerDown(e,loc.entry.id);}:undefined}>
    <circle cx={loc.cx} cy={loc.cy} r={4} fill="transparent"/>
    <circle cx={loc.cx} cy={loc.cy} r={r} fill={isSelected?"#f7f0e6":"#fffcf7"} stroke={isSelected?"#7c4a2d":"#7c4a2d"} strokeWidth={isSelected?0.4:0.28}/>
    <circle cx={loc.cx} cy={loc.cy} r={isHovered||isSelected?0.6:0.4} fill="#7c4a2d" className="transition-all"/>
    {showLabel?<>{loc.labelX!==loc.cx||loc.labelY!==loc.cy?<line x1={loc.cx} y1={loc.cy} x2={loc.labelX} y2={loc.labelY} stroke="#b8a88a" strokeWidth="0.08" opacity="0.3"/>:null}<text x={loc.labelX} y={loc.labelY} textAnchor={loc.labelAnchor} fill="#3d3830" fontWeight={isHovered||isSelected?700:600} style={{fontSize:isHovered||isSelected?"1.9px":"1.7px",...textAttrs}}>{loc.entry.title||"未命名地点"}</text>{catLabel?<text x={loc.labelX} y={loc.labelY+1.4} textAnchor={loc.labelAnchor} fill="#7a7268" style={{fontSize:"1.15px",...textAttrs}}>{catLabel}</text>:null}</>:null}
  </g>);
}

// ── Component ──────────────────────────────────────────────
export function WorldMapView({ projectId }: WorldMapViewProps) {
  const router = useRouter();
  const { hydrated, data, getProject, setProjectWorldMap, editEntry, addEntry } = useStore();
  const project = getProject(projectId);
  const wm = (project?.worldMap??{}) as WorldMapConfig;
  const fileRef = useRef<HTMLInputElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [uploadError, setUploadError] = useState("");

  // Raw locations with position status — batch temporary layout
  const locationData = useMemo(()=>{
    const raw=data.entries.filter((e)=>e.type==="location"&&e.projectId===projectId&&e.locationProfile).map((e):MapLocation=>({entry:e,mapX:e.locationProfile!.mapX,mapY:e.locationProfile!.mapY,parentId:e.locationProfile!.parentLocationId||null}));
    const allIds=raw.map((l)=>l.entry.id);
    const tempMap=generateTemporaryLayout(allIds);
    const unpositioned=raw.filter((l)=>isDefaultMapPosition(l.mapX,l.mapY));
    const withTemp=raw.map((l)=>{
      if(!isDefaultMapPosition(l.mapX,l.mapY))return l;
      const temp=tempMap.get(l.entry.id)??{mapX:0.5,mapY:0.5};
      return{...l,mapX:temp.mapX,mapY:temp.mapY,_isTemp:true as const};
    });
    return{locations:withTemp,unpositionedCount:unpositioned.length};
  },[data.entries,projectId]);
  const locations=locationData.locations;
  const laidOut=useMemo(()=>layoutMapLabels(locations),[locations]);
  const hasUnpositioned=locationData.unpositionedCount>0;
  const hasParentLines=locations.some((l)=>l.parentId&&laidOut.some((p)=>p.entry.id===l.parentId));
  const hasBgImage=Boolean(wm.backgroundImage);

  // transform="translate(offsetX, offsetY) scale(zoom)"  — offset in viewBox units
  const [zoom,setZoom]=useState(1);const [offset,setOffset]=useState({x:0,y:0});
  const [hoveredId,setHoveredId]=useState<string|null>(null);
  const [showLabels,setShowLabels]=useState(true),[showRelations,setShowRelations]=useState(true),[showGrid,setShowGrid]=useState(false);
  const [opacity,setOpacity]=useState(wm.backgroundOpacity??1),[fit,setFit]=useState<"contain"|"cover">(wm.backgroundFit??"contain");
  const [isEditMode,setIsEditMode]=useState(false);
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [draggingLocId,setDraggingLocId]=useState<string|null>(null);
  const [dragTempPos,setDragTempPos]=useState<{x:number;y:number;labelX:number;labelY:number}|null>(null);
  const dragLocRef=useRef<{id:string;startX:number;startY:number;origMapX:number;origMapY:number;loX:number;loY:number}|null>(null);
  const gridBeforeEdit=useRef(false);
  const [createLocAt,setCreateLocAt]=useState<{mapX:number;mapY:number;panelX:number;panelY:number}|null>(null);
  const [newTitle,setNewTitle]=useState("");
  const [saveMsg,setSaveMsg]=useState("");

  // ── SVG coordinate helper (viewBox, handles zoom + pan) ──
  const clientToSVGPoint=useCallback((clientX:number,clientY:number):{x:number;y:number}|null=>{
    const svg=svgRef.current;if(!svg)return null;
    const rect=svg.getBoundingClientRect();
    const sx=(clientX-rect.left)*(100/rect.width);
    const sy=(clientY-rect.top)*(100/rect.height);
    // Inverse of: translate(ox,oy) scale(z)
    // point_at_zoom = (sx - ox) / z
    return{x:(sx-offset.x)/zoom,y:(sy-offset.y)/zoom};
  },[zoom,offset]);

  const dragging=useRef(false),dragStart=useRef({x:0,y:0,ox:0,oy:0}),moved=useRef(false);

  // ── ?location= param → auto-select ─────────────────────
  const searchParams=useSearchParams();
  // Zoom helper (preserve viewport center)
  const applyZoom=useCallback((nextZoom:number)=>{
    const nz=Math.max(MIN_ZOOM,Math.min(MAX_ZOOM,nextZoom));
    setOffset((prev)=>{const cx=(50-prev.x)/zoom;const cy=(50-prev.y)/zoom;return{x:50-cx*nz,y:50-cy*nz};});
    setZoom(nz);
  },[zoom]);
  // Focus: central function for centering map on a location
  const focusLocation=useCallback((id:string)=>{
    const loc=locations.find((l)=>l.entry.id===id);if(!loc)return false;
    setSelectedId(id);
    const cx=loc.mapX*100,cy=loc.mapY*100;
    const tz=zoom<1.25?1.25:zoom;
    applyZoom(tz);
    setOffset({x:50-cx*tz,y:50-cy*tz});
    mapContainerRef.current?.scrollIntoView?.({behavior:window.matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:"start"});
    return true;
  },[locations,zoom,applyZoom]);
  const locationParam=searchParams.get("location");
  const handledLocationParamRef=useRef<string|null>(null);
  useEffect(()=>{
    if(!hydrated)return;
    if(!locationParam){handledLocationParamRef.current=null;return;}
    if(handledLocationParamRef.current===locationParam)return;
    const success=focusLocation(locationParam);
    if(success)handledLocationParamRef.current=locationParam;
  },[hydrated,locationParam,focusLocation]);

  // ── Zoom helpers (preserve viewport center) ──────────────
  const zoomIn=useCallback(()=>applyZoom(zoom+ZOOM_STEP),[applyZoom,zoom]);
  const zoomOut=useCallback(()=>applyZoom(zoom-ZOOM_STEP),[applyZoom,zoom]);
  const resetView=useCallback(()=>{setZoom(1);setOffset({x:0,y:0});},[]);

  // Convert client-pixel delta to viewBox-unit delta
  const clientToViewBox=useCallback((px:number,py:number):{dx:number;dy:number}=>{
    const svg=svgRef.current;if(!svg)return{dx:0,dy:0};
    const rect=svg.getBoundingClientRect();
    return{dx:px*(100/rect.width),dy:py*(100/rect.height)};
  },[]);

  // ── Canvas pan (offset in viewBox units) ─────────────────
  const handlePointerDown=useCallback((e:React.PointerEvent)=>{
    if(draggingLocId)return;
    dragging.current=true;moved.current=false;
    dragStart.current={x:e.clientX,y:e.clientY,ox:offset.x,oy:offset.y};
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  },[offset,draggingLocId]);
  const handlePointerMove=useCallback((e:React.PointerEvent)=>{
    if(!dragging.current)return;
    const v=clientToViewBox(e.clientX-dragStart.current.x,e.clientY-dragStart.current.y);
    if(Math.abs(v.dx)>DRAG_THRESHOLD/10||Math.abs(v.dy)>DRAG_THRESHOLD/10)moved.current=true;
    setOffset({x:dragStart.current.ox+v.dx,y:dragStart.current.oy+v.dy});
  },[clientToViewBox]);

  const saveDragEnd=useCallback(()=>{
    if(!draggingLocId||!dragLocRef.current)return;
    const{id,origMapX,origMapY}=dragLocRef.current;
    const pos=dragTempPos; if(!pos||!moved.current)return;
    const newX=clamp01(pos.x/100),newY=clamp01(pos.y/100);
    if(Math.abs(newX-origMapX)<0.001&&Math.abs(newY-origMapY)<0.001)return;
    const entry=data.entries.find((e)=>e.id===id);if(!entry)return;
    const lp=entry.locationProfile;if(!lp)return;
    editEntry(id,{type:entry.type,title:entry.title,summary:entry.summary,content:entry.content,coverImage:entry.coverImage,galleryImages:entry.galleryImages,imageAltMap:entry.imageAltMap,isFavorite:entry.isFavorite,isPinned:entry.isPinned,tags:entry.tags,relatedEntryIds:entry.relatedEntryIds,locationProfile:{...lp,mapX:newX,mapY:newY}});
    setSaveMsg("位置已保存");setTimeout(()=>setSaveMsg(""),1500);
  },[draggingLocId,dragTempPos,data.entries,editEntry]);

  const clearDrag=useCallback(()=>{
    setDraggingLocId(null);setDragTempPos(null);
    if(dragLocRef.current){dragLocRef.current=null;}
  },[]);

  const handlePointerUp=useCallback(()=>{dragging.current=false;saveDragEnd();clearDrag();},[saveDragEnd,clearDrag]);
  const handlePointerCancel=useCallback(()=>{dragging.current=false;clearDrag();},[clearDrag]);

  // ── Node click ───────────────────────────────────────────
  const handleNodeClick=useCallback((id:string)=>{
    if(moved.current)return;
    if(isEditMode){setSelectedId(id);return;}
    router.push(`/project/${projectId}?entry=${id}`);
  },[router,projectId,isEditMode]);
  const handleHover=useCallback((id:string|null)=>setHoveredId(id),[]);

  // ── Edit: drag location ──────────────────────────────────
  const handleNodePointerDown=useCallback((e:React.PointerEvent,id:string)=>{
    if(!isEditMode)return;
    const loc=locations.find((l)=>l.entry.id===id); if(!loc)return;
    const laid=laidOut.find((l)=>l.entry.id===id);
    const loX=laid?laid.labelX-laid.cx:0,loY=laid?laid.labelY-laid.cy:0;
    dragLocRef.current={id,startX:e.clientX,startY:e.clientY,origMapX:loc.mapX,origMapY:loc.mapY,loX,loY};
    setDraggingLocId(id);setSelectedId(id);
    moved.current=false;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  },[isEditMode,locations,laidOut]);

  const handleLocPointerMove=useCallback((e:React.PointerEvent)=>{
    if(!draggingLocId||!dragLocRef.current)return;
    const dx=e.clientX-dragLocRef.current.startX,dy=e.clientY-dragLocRef.current.startY;
    if(Math.abs(dx)>2||Math.abs(dy)>2)moved.current=true;
    const pt=clientToSVGPoint(e.clientX,e.clientY);if(!pt)return;
    const newX=clamp01(pt.x/100),newY=clamp01(pt.y/100);
    const{loX,loY}=dragLocRef.current;
    setDragTempPos({x:newX*100,y:newY*100,labelX:newX*100+loX,labelY:newY*100+loY});
  },[draggingLocId,clientToSVGPoint]);

  // ── Blank space click → create location ──────────────────
  const handleBlankClick=useCallback((e:React.MouseEvent)=>{
    if(!isEditMode||moved.current||draggingLocId)return;
    const pt=clientToSVGPoint(e.clientX,e.clientY);if(!pt)return;
    const container=mapContainerRef.current;
    const cx=container?e.clientX-container.getBoundingClientRect().left:e.clientX;
    const cy=container?e.clientY-container.getBoundingClientRect().top:e.clientY;
    // Clamp panel position inside container
    const pw=220,ph=140;
    const px=clamp(cx-pw/2,8,Math.max(8,(container?.clientWidth||400)-pw-8));
    const py=clamp(cy-80,8,Math.max(8,(container?.clientHeight||300)-ph-8));
    const mx=clamp01(pt.x/100),my=clamp01(pt.y/100);
    const names=locations.map((l)=>l.entry.title);let t="未命名地点";let n=2;while(names.includes(t)){t=`未命名地点 ${n}`;n++;}
    setNewTitle(t);setCreateLocAt({mapX:mx,mapY:my,panelX:px,panelY:py});
  },[isEditMode,draggingLocId,clientToSVGPoint,locations]);

  const handleCreateLocation=useCallback(()=>{
    if(!createLocAt)return;
    const{mapX,mapY}=createLocAt;
    const title=(newTitle.trim()||"未命名地点").slice(0,80);
    const lp=createEmptyLocationProfile();lp.mapX=mapX;lp.mapY=mapY;
    const entry=addEntry(projectId,{type:"location",title,summary:"",content:"",coverImage:"",galleryImages:[],imageAltMap:{},isFavorite:false,isPinned:false,tags:[],relatedEntryIds:[],locationProfile:lp});
    setCreateLocAt(null);setNewTitle("");setSelectedId(entry.id);
  },[createLocAt,newTitle,addEntry,projectId]);

  const cancelCreate=useCallback(()=>{setCreateLocAt(null);setNewTitle("");},[]);
  const handleCreateKeyDown=useCallback((e:React.KeyboardEvent)=>{
    if(e.key==="Enter"){e.preventDefault();handleCreateLocation();}
    if(e.key==="Escape"){e.preventDefault();cancelCreate();}
  },[handleCreateLocation,cancelCreate]);

  // ── Focus a location (center map + select) ────────────────
  const handleLegendClick=useCallback((id:string)=>{
    if(isEditMode){setSelectedId(id);focusLocation(id);}
    else focusLocation(id);
  },[isEditMode,focusLocation]);

  // ── Upload ──────────────────────────────────────────────
  const handleUploadClick=()=>{setUploadError("");fileRef.current?.click();};
  const handleFileChange=useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
    setUploadError("");const file=e.target.files?.[0];const input=e.target;if(!file)return;
    if(!ALLOWED_TYPES.includes(file.type)){setUploadError("只支持 PNG、JPEG、WebP 格式的图片。");input.value="";return;}
    if(file.size>MAX_FILE_SIZE){setUploadError("图片大小不能超过 1.5MB。");input.value="";return;}
    const reader=new FileReader();
    reader.onload=()=>{setProjectWorldMap(projectId,{backgroundImage:reader.result as string,backgroundImageName:file.name,backgroundOpacity:opacity,backgroundFit:fit});input.value="";};
    reader.onerror=()=>{setUploadError("读取图片失败，请重试。");input.value="";};
    reader.readAsDataURL(file);
  },[projectId,setProjectWorldMap,opacity,fit]);
  const handleRemoveBg=()=>{setProjectWorldMap(projectId,undefined);setOpacity(1);setFit("contain");};
  const handleOpacityChange=(v:number)=>{setOpacity(v);setProjectWorldMap(projectId,{...wm,backgroundOpacity:v});};
  const handleFitChange=(f:"contain"|"cover")=>{setFit(f);setProjectWorldMap(projectId,{...wm,backgroundFit:f});};

  // ── Edit mode toggle ────────────────────────────────────
  const toggleEditMode=()=>{
    if(!isEditMode){gridBeforeEdit.current=showGrid;setShowGrid(true);}
    else{setShowGrid(gridBeforeEdit.current);}
    setIsEditMode((v)=>!v);setSelectedId(null);setCreateLocAt(null);clearDrag();
  };

  const selectedLoc=selectedId?locations.find((l)=>l.entry.id===selectedId):null;

  if(!hydrated)return<div className="flex min-h-screen items-center justify-center text-muted-foreground">正在加载世界地图...</div>;
  if(!project)return<div className="flex min-h-screen flex-col items-center justify-center gap-4"><p className="text-muted-foreground">未找到该世界项目</p><button type="button" className="text-sm text-primary underline" onClick={()=>router.push("/")}>返回项目列表</button></div>;

  return(<div className="flex min-h-dvh flex-col lg:h-screen lg:overflow-hidden">
    <TopBar project={project} backHref={`/project/${projectId}`} backLabel="返回项目"/>
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="font-serif text-2xl font-semibold">世界地图</h1><p className="mt-1 text-sm text-muted-foreground">用地图底图与地点标注整理你的世界空间关系</p></div>
          <div className="flex items-center gap-2">
            <Button variant={isEditMode?"default":"outline"} size="sm" className="gap-1.5" onClick={toggleEditMode}>{isEditMode?<>退出编辑</>:<><Edit3 className="h-3.5 w-3.5"/>编辑地图</>}</Button>
            {locations.length>0?<div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1"><Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={zoomIn} title="放大"><Plus className="h-3.5 w-3.5"/></Button><Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={zoomOut} title="缩小"><Minus className="h-3.5 w-3.5"/></Button><Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={resetView} title="重置"><RotateCcw className="h-3.5 w-3.5"/></Button><span className="px-1.5 text-xs text-muted-foreground">{Math.round(zoom*100)}%</span></div>:null}
          </div>
        </div>

        {locations.length===0?(
          <EmptyState icon={Map} title="该项目还没有地点条目" description="创建地点并设置坐标后，可在地图上标注它们的位置。" action={<Button variant="outline" onClick={()=>router.push(`/project/${projectId}`)}>返回项目</Button>}/>
        ):(<>
          {hasUnpositioned?<div className="mb-4 rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-2 text-center text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">有 {locationData.unpositionedCount} 个地点尚未设置地图坐标，当前已临时分散显示。进入编辑模式拖动地点后即可保存正式位置。</div>:null}
          {isEditMode?<div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-center text-sm text-muted-foreground">点击地点可选中 · 拖动地点可调整位置 · 点击空白处可新建地点</div>:null}

          <div className="mb-4 space-y-2 rounded-lg border border-border/60 bg-card/40 px-4 py-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0"><ImageIcon className="h-4 w-4 shrink-0 text-muted-foreground"/><div className="min-w-0"><span className="text-sm font-medium">地图底图</span>{hasBgImage?<span className="ml-2 text-xs text-muted-foreground">{wm.backgroundImageName||"自定义底图"}</span>:<span className="ml-2 text-xs text-muted-foreground">当前使用默认纸面底图</span>}</div></div>
              <div className="flex items-center gap-1.5">
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFileChange}/>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={handleUploadClick}><Upload className="h-3.5 w-3.5"/>{hasBgImage?"更换底图":"上传底图"}</Button>
                {hasBgImage?<Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:bg-destructive/10" onClick={handleRemoveBg}><Trash2 className="h-3.5 w-3.5"/></Button>:null}
              </div>
            </div>
            {hasBgImage?<div className="flex flex-wrap items-center gap-3 border-t border-border/40 pt-2">
              <div className="flex items-center gap-1.5 text-xs"><span className="text-muted-foreground">透明</span><input type="range" min="0.2" max="1" step="0.05" value={opacity} onChange={(e)=>handleOpacityChange(Number(e.target.value))} className="h-4 w-20"/><span className="text-muted-foreground w-8">{Math.round(opacity*100)}%</span></div>
              <div className="flex items-center gap-1"><button onClick={()=>handleFitChange("contain")} className={`rounded px-1.5 py-0.5 text-xs transition-colors ${fit==="contain"?"bg-primary/10 text-primary":"text-muted-foreground hover:bg-accent"}`}>完整</button><button onClick={()=>handleFitChange("cover")} className={`rounded px-1.5 py-0.5 text-xs transition-colors ${fit==="cover"?"bg-primary/10 text-primary":"text-muted-foreground hover:bg-accent"}`}>填满</button></div>
            </div>:null}
            {uploadError?<p className="text-xs text-destructive">{uploadError}</p>:null}
            <p className="text-xs text-muted-foreground/70">地图图片会保存在本地浏览器数据与备份文件中，建议使用 1.5MB 以下图片。</p>
          </div>

          <div className="relative" ref={mapContainerRef}><div className="touch-none overflow-hidden rounded-xl border border-border/70"
            style={{cursor:dragging.current?"grabbing":"grab",background:hasBgImage?"transparent":"linear-gradient(135deg, #faf6ee 0%, #f5efe0 40%, #faf7f2 100%)"}}
            onPointerDown={handlePointerDown} onPointerMove={isEditMode&&draggingLocId?handleLocPointerMove:handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerCancel} onPointerLeave={handlePointerUp}>
            <svg ref={svgRef} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="h-auto w-full" style={{touchAction:"none"}}>
              {/* ── World layer 1: background + decor ────────── */}
              <g transform={`translate(${offset.x}, ${offset.y}) scale(${zoom})`}>
                {hasBgImage?<image href={wm.backgroundImage} x={fit==="contain"?3:0} y={fit==="contain"?3:0} width={fit==="contain"?94:100} height={fit==="contain"?94:100} preserveAspectRatio={fit==="contain"?"xMidYMid meet":"xMidYMid slice"} opacity={opacity}/>:null}
                <rect x="3" y="3" width="94" height="94" rx="1.5" fill="none" stroke="#d4c8b0" strokeWidth="0.15" opacity="0.4"/>
                <rect x="5" y="5" width="90" height="90" rx="1" fill="none" stroke="#d4c8b0" strokeWidth="0.06" opacity="0.25"/>
                {showGrid?[25,50,75].map((n)=>(<g key={n}><line x1={n} y1="0" x2={n} y2="100" stroke="#d4c8b0" strokeWidth="0.04" strokeDasharray="1.5 3" opacity="0.35"/><line x1="0" y1={n} x2="100" y2={n} stroke="#d4c8b0" strokeWidth="0.04" strokeDasharray="1.5 3" opacity="0.35"/></g>)):null}
                {showGrid?<><line x1="50" y1="6" x2="50" y2="94" stroke="#c4b898" strokeWidth="0.06" opacity="0.2"/><line x1="6" y1="50" x2="94" y2="50" stroke="#c4b898" strokeWidth="0.06" opacity="0.2"/></>:null}
                <text x="50" y="2.8" textAnchor="middle" fill="#8a7a6a" stroke="none" style={{fontSize:"1.1px",opacity:0.3}}>北</text><text x="50" y="98" textAnchor="middle" fill="#8a7a6a" stroke="none" style={{fontSize:"1.1px",opacity:0.3}}>南</text>
                <text x="2.2" y="50.5" textAnchor="middle" fill="#8a7a6a" stroke="none" style={{fontSize:"1.1px",opacity:0.3}}>西</text><text x="97.8" y="50.5" textAnchor="middle" fill="#8a7a6a" stroke="none" style={{fontSize:"1.1px",opacity:0.3}}>东</text>
                <CompassRose/>
              </g>

              {/* Transparent rect catches blank-space clicks (outside world transform) */}
              {isEditMode?<rect x="0" y="0" width="100" height="100" fill="transparent" onClick={handleBlankClick}/>:null}

              {/* ── World layer 2: relations + location nodes ── */}
              <g transform={`translate(${offset.x}, ${offset.y}) scale(${zoom})`}>
                {showRelations&&hasParentLines?laidOut.map((loc)=>{if(!loc.parentId)return null;const parent=laidOut.find((p)=>p.entry.id===loc.parentId);if(!parent)return null;return<MapRelationLine key={`${parent.entry.id}-${loc.entry.id}`} parent={parent} child={loc}/>;}):null}
                {laidOut.map((loc)=>{
                  const isDragging=draggingLocId===loc.entry.id;
                  const displayLoc=isDragging&&dragTempPos?{...loc,cx:dragTempPos.x,cy:dragTempPos.y,labelX:dragTempPos.labelX,labelY:dragTempPos.labelY}:loc;
                  return<MapNode key={loc.entry.id} loc={displayLoc} onClick={handleNodeClick} isHovered={hoveredId===loc.entry.id} onHover={handleHover} showLabel={showLabels} isSelected={selectedId===loc.entry.id} onNodePointerDown={isEditMode?handleNodePointerDown:undefined}/>;
                })}
              </g>
            </svg>
          </div>

          <div className="pointer-events-none absolute right-2 bottom-2 z-10 sm:right-3 sm:bottom-3" onPointerDown={(e)=>e.stopPropagation()}>
            <div className="pointer-events-auto rounded-lg border border-border/60 bg-card/90 px-2.5 py-2 shadow-sm backdrop-blur-sm">
              <div className="mb-1.5 flex items-center gap-1.5 border-b border-border/50 pb-1"><Layers className="h-3 w-3 text-muted-foreground"/><span className="text-xs font-medium text-muted-foreground">图层</span><span className="ml-auto text-xs text-muted-foreground">{locations.length} 地点</span></div>
              <div className="flex flex-wrap items-center gap-1">
                <button type="button" onClick={(e)=>{e.stopPropagation();setShowLabels((v)=>!v);}} title={showLabels?"隐藏标签":"显示标签"} className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs transition-colors ${showLabels?"bg-primary/10 text-primary":"text-muted-foreground hover:bg-accent"}`}><Eye className="h-3 w-3"/>标签</button>
                <button type="button" onClick={(e)=>{e.stopPropagation();setShowRelations((v)=>!v);}} title={showRelations?"隐藏关系线":"显示关系线"} className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs transition-colors ${showRelations?"bg-primary/10 text-primary":"text-muted-foreground hover:bg-accent"}`}><Hash className="h-3 w-3"/>关系</button>
                <button type="button" onClick={(e)=>{e.stopPropagation();setShowGrid((v)=>!v);}} title={showGrid?"隐藏网格":"显示网格"} className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs transition-colors ${showGrid?"bg-primary/10 text-primary":"text-muted-foreground hover:bg-accent"}`}>网格</button>
              </div>
            </div>
          </div>

          {/* Create location floating panel — inside relative container */}
          {isEditMode&&createLocAt?<div className="absolute z-20" style={{left:createLocAt.panelX,top:createLocAt.panelY}} onPointerDown={(e)=>e.stopPropagation()} onPointerMove={(e)=>e.stopPropagation()} onClick={(e)=>e.stopPropagation()}>
            <div className="rounded-lg border border-primary/30 bg-card px-4 py-3 shadow-lg w-52">
              <div className="mb-1 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary shrink-0"/><span className="text-sm font-medium">创建地点</span></div>
              <p className="mb-2 text-xs text-muted-foreground">X {Math.round(createLocAt.mapX*100)} · Y {Math.round(createLocAt.mapY*100)}</p>
              <input autoFocus className="mb-2 h-8 w-full rounded border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="地点名称" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} onKeyDown={handleCreateKeyDown} onPointerDown={(e)=>e.stopPropagation()}/>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleCreateLocation}>创建</Button>
                <Button variant="ghost" size="sm" onClick={cancelCreate}><X className="h-3.5 w-3.5"/></Button>
              </div>
            </div>
          </div>:null}
          </div>

          {isEditMode&&selectedLoc?<div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
            <div className="min-w-0">
              <span className="text-sm font-medium">{selectedLoc.entry.title||"未命名地点"}</span>
              {selectedLoc.entry.locationProfile?.locationCategory?<span className="ml-1.5 text-xs text-muted-foreground">{LOCATION_CATEGORY_LABELS[selectedLoc.entry.locationProfile.locationCategory]||selectedLoc.entry.locationProfile.locationCategory}</span>:null}
              <span className="ml-2 text-xs text-muted-foreground">{formatMapCoordLabel(selectedLoc.mapX,selectedLoc.mapY)}{selectedLoc._isTemp?<span className="ml-1.5 text-xs text-amber-600 dark:text-amber-400">临时位置 · 尚未保存</span>:null}</span>
            </div>
            <div className="flex items-center gap-2">
              {saveMsg?<span className="text-xs text-green-700 dark:text-green-400">{saveMsg}</span>:null}
              <Button variant="outline" size="sm" className="gap-1 shrink-0" onClick={()=>{setIsEditMode(false);setShowGrid(gridBeforeEdit.current);router.push(`/project/${projectId}?entry=${selectedLoc.entry.id}`);}}><ExternalLink className="h-3.5 w-3.5"/>打开详情</Button>
            </div>
          </div>:null}

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <p className="text-xs text-muted-foreground/70 mb-2 col-span-full">点击下方地点可在地图中定位；点击地图标记可打开详情。</p>
          {locations.map((loc)=>{const p=loc.entry.locationProfile;return<button key={loc.entry.id} type="button" onClick={()=>handleLegendClick(loc.entry.id)} onPointerEnter={()=>setHoveredId(loc.entry.id)} onPointerLeave={()=>setHoveredId(null)} aria-pressed={selectedId===loc.entry.id} className={`flex min-h-[2.5rem] items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${selectedId===loc.entry.id?"border-primary/40 bg-primary/5":"border-border/60 bg-card/40 hover:bg-accent/50"}`}><span>{ENTRY_TYPE_ICONS.location}</span><span className="flex-1 font-medium truncate">{loc.entry.title||"未命名地点"}</span>{p?.locationCategory?<span className="shrink-0 text-xs text-muted-foreground">{LOCATION_CATEGORY_LABELS[p.locationCategory]||p.locationCategory}</span>:null}</button>;})}</div>
        </>)}
      </div>
    </div>
  </div>);
}
