import type { AppData } from "@/types";

const DEMO_PROJECT_ID = "demo-project-aurora";

const DEMO_ENTRY_IDS = {
  character: "demo-entry-linwanxing",
  location: "demo-entry-academy",
  faction: "demo-entry-order",
  lore: "demo-entry-phenomenon",
  item: "demo-entry-amulet",
  event: "demo-entry-frostline",
  species: "demo-entry-fox",
  note: "demo-entry-memo",
  observatory: "demo-entry-observatory",
} as const;

const DEMO_IMAGES = {
  characterCover: "https://picsum.photos/seed/linwanxing/900/520",
  characterGallery1: "https://picsum.photos/seed/lin-rune/600/400",
  characterGallery2: "https://picsum.photos/seed/lin-night/600/400",
  locationCover: "https://picsum.photos/seed/starfall-academy/900/520",
  locationGallery: "https://picsum.photos/seed/academy-tower/600/400",
};

export function createDemoData(): AppData {
  const now = new Date().toISOString();
  const projectCreated = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString();

  const characterCover = DEMO_IMAGES.characterCover;
  const gallery1 = DEMO_IMAGES.characterGallery1;
  const gallery2 = DEMO_IMAGES.characterGallery2;

  return {
    characterRelations: [],
    projects: [
      {
        id: DEMO_PROJECT_ID,
        name: "星落纪元",
        description: "一个漂浮大陆与古老魔法交织的奇幻世界，适合作为 demo 体验。",
        createdAt: projectCreated,
        updatedAt: now,
      },
    ],
    entries: [
      {
        id: DEMO_ENTRY_IDS.character,
        projectId: DEMO_PROJECT_ID,
        type: "character",
        title: "林晚星",
        summary: "星落学院最年轻的符文学徒，性格安静但观察力极强。",
        content: `<p>林晚星出生于边境小镇，幼年时目睹「星落」异象后获得感知符纹的能力。</p><p>她不善言辞，习惯用笔记记录细节。对古老符文有近乎直觉的理解，却总在关键时刻犹豫。</p><p><img src="${gallery1}" alt="林晚星符纹笔记"></p><p>目标：找到星落异象的真相，并证明符文学并非只属于贵族。</p>`,
        coverImage: characterCover,
        galleryImages: [gallery1, gallery2],
        imageAltMap: {
          [characterCover]: "林晚星 · 设定立绘",
          [gallery1]: "符纹笔记局部",
          [gallery2]: "星落之夜速写",
        },
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: true,
        isPinned: true,
        tags: ["主角", "符文学", "星落"],
        relatedEntryIds: [
          DEMO_ENTRY_IDS.location,
          DEMO_ENTRY_IDS.item,
          DEMO_ENTRY_IDS.lore,
          DEMO_ENTRY_IDS.observatory,
        ],
        characterProfile: {
          displayName: "林晚星",
          aliases: ["晚星", "Lin", "星痕学徒"],
          pronouns: "她",
          ageText: "17 岁（外表），实际出生年份成谜",
          gender: "女",
          identity: "星落学院符文学徒 · 边境出身",
          factionId: "",
          locationId: DEMO_ENTRY_IDS.location,
          speciesId: DEMO_ENTRY_IDS.species,
          appearance:
            "身形清瘦，及肩黑发常以布带束起。左眼下方有淡银色星痕，在星落期间会微微发亮。常穿学院改良制服，袖口缝有自制符纹补丁。",
          personality:
            "安静寡言，观察力极强，对细节近乎偏执。不善社交但在符文学上极具直觉。关键时刻容易犹豫，正在学习相信自己的判断。",
          abilities:
            "符纹感知：能「看见」魔力流动的纹路走向。\n残响护符共鸣：星落期间可短暂放大感知范围。\n笔记推演：习惯用速写与符号记录，事后还原现场细节。",
          goals: "查明星落异象真相；证明符文学并非贵族专利；找到幼时异象与自身星痕的联系。",
          background:
            "出生于苍岚浮空岛边境小镇。七岁时目睹星落异象，此后出现星痕与符纹感知能力。十二岁被星落学院破格录取，成为近年最年轻的符文学徒之一。\n\n因出身平民，在学院内面临隐性排挤，却也因此更努力地记录与验证每一条符文理论。",
          trivia:
            "习惯在深夜去观星台速写星象；对云栖狐有莫名亲近感；喝茶只喝不加糖的粗茶。",
          statusText: "在读 · 第一卷主线",
          quote: "符文不会说谎，只是我们还不会读。",
        },
      },
      {
        id: DEMO_ENTRY_IDS.location,
        projectId: DEMO_PROJECT_ID,
        type: "location",
        title: "星落学院",
        summary: "建立在浮空岛边缘的古老学府，以符文学与星象学闻名。",
        content:
          "星落学院位于主浮空岛「苍岚」的东缘，三层环形建筑环绕中央观星台。\n\n学院对外招收有天赋的平民，但核心典籍仍由几个古老家族把持。\n\n传说学院地底封存着第一次星落时坠落的碎片。",
        coverImage: DEMO_IMAGES.locationCover,
        galleryImages: [DEMO_IMAGES.locationGallery],
        imageAltMap: {
          [DEMO_IMAGES.locationCover]: "星落学院远景",
          [DEMO_IMAGES.locationGallery]: "观星台与环形回廊",
        },
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["学院", "浮空岛"],
        relatedEntryIds: [DEMO_ENTRY_IDS.character, DEMO_ENTRY_IDS.faction, DEMO_ENTRY_IDS.observatory],
        locationProfile: {
          locationCategory: "academy",
          status: "active",
          parentLocationId: "",
          governingFactionId: DEMO_ENTRY_IDS.faction,
          environment:
            "学院建在主浮空岛「苍岚」东缘，环形回廊常年被高空气流与星尘微光包围。白昼能俯瞰云海，夜晚则能直接观测星落轨迹。",
          landmarks:
            "中央观星台：用于观测星落与绘制星图的高塔。\n环形回廊：连接教学区、宿舍与藏书区的三层廊桥。\n地底封存库：传说保存着第一次星落时坠落的未知碎片。",
          history:
            "星落学院由第一批星象学者建立，最初只是观测站，后来逐渐发展为符文学与星象学并重的古老学府。\n\n学院曾长期只招收贵族学生，近几十年才开始破格接收具有特殊天赋的平民。",
          access:
            "正式学生、导师与获准访客可进入学院主体区域。中央观星台夜间需要预约，地底封存库仅对少数导师开放。\n\n星落期间学院会进入临时封闭状态，外来人员不得随意进出。",
          creatorNotes:
            "这个地点承担第一卷的主要舞台功能：既是安全的学习场所，也是阶级差异、知识垄断与星落秘密逐渐浮现的核心空间。",
        },
      },
      {
        id: DEMO_ENTRY_IDS.observatory,
        projectId: DEMO_PROJECT_ID,
        type: "location",
        title: "中央观星台",
        summary: "星落学院内部用于观测星落与绘制星图的高塔，也是林晚星最常独处的角落。",
        content: "",
        coverImage: "",
        galleryImages: [],
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["学院", "观星台", "星落"],
        relatedEntryIds: [
          DEMO_ENTRY_IDS.location,
          DEMO_ENTRY_IDS.character,
          DEMO_ENTRY_IDS.lore,
        ],
        locationProfile: {
          locationCategory: "building",
          status: "active",
          parentLocationId: DEMO_ENTRY_IDS.location,
          governingFactionId: DEMO_ENTRY_IDS.faction,
          environment:
            "观星台位于学院三层环形建筑的正中央，塔顶四周没有遮挡，夜晚能看见星尘沿透明穹顶缓慢流动。",
          landmarks:
            "主观测镜：能够捕捉星落前的微弱轨迹。\n星图地板：镶嵌着历代学徒修正过的星象线。\n静默阶梯：通往塔顶的螺旋石阶，传说会吸收脚步声。",
          history:
            "中央观星台是学院最早建成的部分。历代星象学者都曾在这里记录星落周期，许多被封存的星落预言也源自此处。",
          access:
            "白天向学生开放，夜间观测需要导师许可。星落前后三日，观星台由学院与守序会共同监管。",
          creatorNotes:
            "可以作为林晚星独处、发现异常星图、触发关键线索的常用场景。",
        },
      },
      {
        id: DEMO_ENTRY_IDS.faction,
        projectId: DEMO_PROJECT_ID,
        type: "faction",
        title: "守序会",
        summary: "主张严格管控魔法使用的保守组织，与学院内部派系关系密切。",
        content:
          "守序会起源于三百年前的大魔法失控事件。他们相信 unrestricted magic 会再次引发灾难。\n\n对外以「魔法安全顾问」身份活动，实际上深度介入各国立法。\n\n与林晚星的导师存在隐秘联系。",
        coverImage: "",
        galleryImages: [],
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["组织", "政治"],
        relatedEntryIds: [DEMO_ENTRY_IDS.location, DEMO_ENTRY_IDS.event],
      },
      {
        id: DEMO_ENTRY_IDS.lore,
        projectId: DEMO_PROJECT_ID,
        type: "lore",
        title: "星落异象",
        summary: "七十年一次，天空洒落光屑，魔力浓度骤升的世界级现象。",
        content:
          "据《苍岚纪年》记载，星落异象已观测到十二次。每次星落后，新生儿的魔法天赋比例显著上升，同时会出现无法解释的「星痕」个体。\n\n学界对此有「神赐」「裂隙」「古文明复苏」等多种假说，尚无定论。",
        coverImage: "",
        galleryImages: [],
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: true,
        isPinned: false,
        tags: ["世界观", "魔法", "星落"],
        relatedEntryIds: [DEMO_ENTRY_IDS.character, DEMO_ENTRY_IDS.item],
      },
      {
        id: DEMO_ENTRY_IDS.item,
        projectId: DEMO_PROJECT_ID,
        type: "item",
        title: "残响护符",
        summary: "林晚星随身携带的护符，能在星落期间短暂放大感知。",
        content:
          "护符材质不明，表面刻有半枚残缺符文。林晚星在异象之夜于河边拾得。\n\n激活时会发出极轻的嗡鸣，佩戴者能「听见」附近魔力的流动方向。\n\n副作用：连续使用超过三次会导致短暂失聪。",
        coverImage: "",
        galleryImages: [],
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["道具", "符文学"],
        relatedEntryIds: [DEMO_ENTRY_IDS.character, DEMO_ENTRY_IDS.lore],
      },
      {
        id: DEMO_ENTRY_IDS.event,
        projectId: DEMO_PROJECT_ID,
        type: "event",
        title: "边境冲突·霜线",
        summary: "浮空岛与地表王国在霜线矿区的领土争端，近期再度升级。",
        content:
          "霜线矿区出产星银，是符文学的重要材料。地表王国「北境联盟」声称矿区自古属于他们，浮空岛议会则依据两百年前的《云陆条约》主张开采权。\n\n冲突已造成多次小规模交火，学院被要求保持中立，但学生中已有不同立场的小团体形成。",
        coverImage: "",
        galleryImages: [],
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["冲突", "政治"],
        relatedEntryIds: [DEMO_ENTRY_IDS.faction],
      },
      {
        id: DEMO_ENTRY_IDS.species,
        projectId: DEMO_PROJECT_ID,
        type: "species",
        title: "云栖狐",
        summary: "栖息在浮空岛边缘的灵性生物，能感知魔力潮汐。",
        content:
          "云栖狐体型接近家猫，尾毛呈半透明状，在星落期间会发出微光。\n\n它们不攻击人类，但极难接近。星落学院有记录表明，云栖狐会引导迷路的旅人走向安全路径。\n\n民间视其为吉兆，贵族则曾试图捕获作为宠物，现已立法保护。",
        coverImage: "",
        galleryImages: [],
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["生物", "浮空岛"],
        relatedEntryIds: [DEMO_ENTRY_IDS.location],
      },
      {
        id: DEMO_ENTRY_IDS.note,
        projectId: DEMO_PROJECT_ID,
        type: "note",
        title: "创作备忘",
        summary: "关于主线节奏与角色关系的随手记录。",
        content:
          "- 第一卷重点：林晚星入学 + 第一次星落预告\n- 守序会不宜过早黑化，保持灰色立场\n- 残响护符的来历可留到第二卷揭晓\n- 云栖狐可作为章节间的温柔调剂",
        coverImage: "",
        galleryImages: [],
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["创作", "备忘"],
        relatedEntryIds: [DEMO_ENTRY_IDS.character],
      },
    ],
  };
}

export const DEMO_INIT_KEY = "world-archive-demo-initialized";

export function seedIfEmpty(data: AppData): AppData {
  if (data.projects.length === 0 && data.entries.length === 0) {
    if (typeof window === "undefined") return data;
    if (localStorage.getItem(DEMO_INIT_KEY)) return data;
    localStorage.setItem(DEMO_INIT_KEY, "1");
    return createDemoData();
  }
  return data;
}
