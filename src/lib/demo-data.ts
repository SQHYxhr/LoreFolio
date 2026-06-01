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
        factionProfile: {
          factionCategory: "government",
          status: "active",
          parentFactionId: "",
          headquartersLocationId: DEMO_ENTRY_IDS.location,
          ideology:
            "主张「秩序先于自由」，认为未经约束的魔法力量终将反噬文明。守序会的信条是：一切超常之力都应受到观测、评估与规制，而非交由个人意志随意使用。",
          structure:
            "守序会采用三阶议事制：最高决策层为「星律议会」，负责制定核心政策；中层为各浮空岛派驻的「观察官」，负责监督与报告；基层为分散在学院、法庭与边境的「执律人」，执行具体事务。",
          influence:
            "守序会的影响力横跨多个浮空岛，尤其在立法与教育领域。他们通过「魔法安全顾问」身份介入各国议会，同时与星落学院保持密切合作，实质上参与制定符文学的研究边界与星落观测准则。",
          history:
            "三百年前「大魔法失控事件」导致数座浮空岛半毁。幸存者中的七位星象学者与战法师共同组建了守序会，誓言不再让魔法脱离人类的理性掌控。此后守序会逐渐从应急组织演变为跨国规制机构，但也因其铁腕政策引发争议。",
          creatorNotes:
            "守序会的定位是灰色势力，而非纯粹反派。他们的担忧有历史依据，手段也有温和与强硬之分。在主线中，守序会内部对「星落异象」的态度并不统一，这可以成为林晚星与之产生复杂互动的切入点。",
        },
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
        itemProfile: {
          itemCategory: "accessory",
          status: "intact",
          ownerCharacterId: DEMO_ENTRY_IDS.character,
          currentLocationId: "",
          creatorFactionId: "",
          origin:
            "林晚星七岁那年星落异象之夜，于苍岚浮空岛边境的浅溪中拾得此护符。护符半埋于河床星砂之中，符文在星光下微微泛光，仿佛一直在等待被找到。",
          appearance:
            "护符约拇指大小，呈不规则椭圆形，通体半透明，内里仿佛封存着极细微的星尘。表面刻有半枚残缺符文，符纹走向无法辨认完整的笔画，但在星落期间会自行浮现第二层暗纹。",
          function:
            "佩戴者能在星落期间短暂「听见」附近魔力的流动方向，如同耳边多了一层感知维度。护符本身不主动增幅魔力，只作为感知的延伸。激活时发出极轻的嗡鸣，仿佛某种古老共鸣。",
          materials:
            "材质经学院多次检测仍未能确定，与已知矿物、合金均不一致。初步推测与星落坠落碎片高度相关，但尚无直接证据。护符表面温度恒定，不受外界环境影响。",
          history:
            "护符的残缺符文与《苍岚纪年》中记载的「星落符文」有一定相似度，但无法确认年代。曾有学者推测它属于更早的星落周期产物，因残缺而未被完整收录。目前护符的历史仍是一个开放的谜题。",
          limitations:
            "连续使用超过三次会导致佩戴者短暂失聪，持续时间随使用次数递增。初次约一炷香后恢复，连续五次以上可能持续数日。学院医疗科将此现象称为「残余共鸣效应」，建议每次星落周期内不超过两次使用。",
          creatorNotes:
            "残响护符是第一卷中林晚星的核心道具，也是她感知能力的来源之一。护符的来历和残缺符文的含义可以在第二卷中作为重要线索展开。建议保持神秘感，不要过早解释全部设定。",
        },
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
        eventProfile: {
          eventCategory: "conflict",
          status: "ongoing",
          chronology: "星历纪元",
          startDateText: "星历 102 年秋",
          endDateText: "",
          locationId: "",
          primaryFactionId: DEMO_ENTRY_IDS.faction,
          participantCharacterIds: [],
          involvedFactionIds: [DEMO_ENTRY_IDS.faction],
          relatedItemIds: [DEMO_ENTRY_IDS.item],
          cause:
            "星落异象之后，苍岚浮空岛与北境联盟在霜线矿区的星银矿脉归属问题持续升温。北境联盟声称矿区自古属于地表，而浮空岛议会依据《云陆条约》主张开采权。双方围绕矿脉的观测权与封锁政策产生了多轮摩擦。",
          process:
            "守序会以「魔法安全评估」为由介入调查，并对霜线矿区实施了部分封锁。这一举措引发了边境聚落居民、自由研究者与地方势力之间的激烈争执，小规模交火与情报间谍事件频繁发生。",
          result:
            "目前冲突尚未完全结束，双方在矿区外围形成对峙状态。部分敏感档案被守序会内部封存，外界难以获知全部真相。",
          impact:
            "霜线冲突加深了星落学院与守序会之间的微妙裂痕，也使得星银研究、符文学进展与边境政治搅在了一起，学院内部逐渐分化出不同立场的学者团体。",
          aftermath:
            "有迹象表明霜线矿区的争端背后可能牵涉残响护符的起源、星落异象与更早的历史事件之间的隐秘联系，这些线索有待进一步揭开。",
          creatorNotes:
            "霜线冲突可作为主线政治剧情、角色卷入点或守序会内部派系斗争的舞台，建议根据第一卷主线节奏决定何时深入展开。",
        },
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
