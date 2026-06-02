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
        id: "demo-entry-character-sorin",
        projectId: DEMO_PROJECT_ID,
        type: "character",
        title: "索林·维恩",
        summary: "守序会执律人，出身星落贵族世家，对林晚星的平民身份与符文学天赋持矛盾态度。",
        content: "索林是守序会最年轻的执律人之一。他的家族维恩氏在浮空岛议会中占有席位，自幼接受正统符文学教育。\n\n他在星落学院与林晚星同期入学，最初因她的平民出身而轻视她，却在一次实战符纹测试中惊讶于她的天赋。\n\n他对守序会的教条深信不疑，但林晚星的存在动摇了他对「天赋与出身成正比」这一信念。",
        coverImage: "",
        galleryImages: [],
        imageAltMap: {},
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["贵族", "守序会", "符文学"],
        relatedEntryIds: [DEMO_ENTRY_IDS.faction, DEMO_ENTRY_IDS.location],
        characterProfile: {
          displayName: "索林·维恩",
          aliases: ["索林", "维恩执律人"],
          pronouns: "他",
          ageText: "19 岁",
          gender: "男",
          identity: "守序会执律人 · 维恩家族继承人",
          factionId: DEMO_ENTRY_IDS.faction,
          locationId: DEMO_ENTRY_IDS.location,
          speciesId: "",
          appearance:
            "身形修长，金棕色短发梳理整齐，常穿守序会深蓝色执律人制服。面容端正，眉眼间带着贵族子弟特有的矜持，但并非傲慢——更多是长期规训形成的审慎。",
          personality:
            "理性自律，对规则有近乎固执的尊重。内心深处对「秩序」的信奉源自家族传统而非盲从，这也意味着他有可能在面临真正的不公时质疑守序会。对林晚星的态度从轻视到困惑再到暗自敬佩，是他角色弧的主要方向。",
          abilities:
            "正统符文学训练背景，擅长符文解码与魔力流动分析。在实战符文应用方面不如林晚星富有直觉，但理论功底扎实，在符文学笔试中名列前茅。",
          goals: "以家族期望为指引，希望成为守序会的星律议会成员；同时内心开始质疑守序会的某些做法是否真的符合正义。",
          background:
            "维恩家族是浮空岛议会的创始家族之一。索林从小接受严格的符文学与政治训练，被家族寄予厚望。他的母亲是现任星律议会成员，对索林的影响深远。\n\n进入守序会后，他被分配到星落学院作为驻院执律人，这也是他与林晚星产生交集的原因。",
          trivia: "私下会在笔记中记录林晚星的符文解法；对云栖狐有一种说不清的亲近感；不喝学院提供的粗茶，总是自带家族特供的茶叶。",
          statusText: "在读 · 守序会驻院执律人",
          quote: "规则不是用来束缚人的，是用来保护那些无力保护自己的人。",
        },
      },
      {
        id: "demo-entry-character-elara",
        projectId: DEMO_PROJECT_ID,
        type: "character",
        title: "艾拉·星语",
        summary: "星落学院符文学导师，温和而敏锐，是林晚星的引路人，也是学院内部改革派的代表人物。",
        content: "艾拉导师在星落学院执教符文学已有十五年。她出生于学者家庭，年轻时曾亲历一次星落，那次经历改变了她对学院知识垄断的看法。\n\n她是林晚星的入学推荐人，也是少数几个在学院内部公开主张「符文学应为所有人服务」的导师。\n\n她与守序会保持礼貌但疏远的关系，认为守序会对知识的封锁不利于文明的长远发展。",
        coverImage: "",
        galleryImages: [],
        imageAltMap: {},
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["导师", "学院", "符文学"],
        relatedEntryIds: [DEMO_ENTRY_IDS.location, DEMO_ENTRY_IDS.faction],
        characterProfile: {
          displayName: "艾拉·星语",
          aliases: ["艾拉导师", "艾拉"],
          pronouns: "她",
          ageText: "42 岁",
          gender: "女",
          identity: "星落学院符文学导师 · 改革派学者",
          factionId: "",
          locationId: DEMO_ENTRY_IDS.location,
          speciesId: "",
          appearance:
            "学者气质，深棕色长发常以简单的发簪束起。面容温和平静，眼角有细纹，是常年伏案阅读留下的痕迹。穿着朴素但整洁的学院导师袍，袖口有自己绣的浅色符文。",
          personality:
            "温和而坚定，对学生极有耐心但从不降低标准。善于观察学生的天赋方向而不急于纠正。在学院政治中保持低调但关键时刻从不退缩。相信知识的力量可以跨越阶级。",
          abilities:
            "深入研究符文学十五年，尤其擅长符文演化史。不是最强的实战符文师，但对符文理论和教学有独到见解。能识别学生的天赋倾向并针对性引导。",
          goals: "推动学院改革，让更多有天赋的平民学生进入学院学习；研究星落与符文学起源之间的联系。",
          background:
            "出生于学者家庭，父母都是星落学院的图书管理员。年轻时在星落期间目睹一位平民符文学徒因缺乏训练而失控受伤，从此致力于推动符文学教育的平民化。\n\n十五年前成为正式导师，培养了多位优秀学生，林晚星是她最寄予厚望的一个。",
          trivia: "私下收藏了许多被守序会认定为「不稳定」的符文样本；喜欢在观星台的静默阶梯上阅读；从不使用符文学为自己谋取便利。",
          statusText: "在职 · 学院符文学导师",
          quote: "天赋不认门第，只认心之所向。",
        },
      },
      {
        id: "demo-entry-character-kane",
        projectId: DEMO_PROJECT_ID,
        type: "character",
        title: "凯恩·铁砂",
        summary: "边境矿区的平民矿工，因霜线冲突失去了家人，对贵族与守序会都抱有深深的不信任。",
        content: "凯恩是苍岚浮空岛边境地区的一名矿工。他的家族三代在霜线矿区开采星银，生活在浮空岛体系的最底层。\n\n星历 102 年的霜线冲突中，凯恩的家人在一次矿脉争夺战中丧生。他从此对贵族与守序会持敌视态度，并开始秘密组织边境矿工的互助团体。\n\n他与林晚星素未谋面，但作为同样出身底层的年轻人，他的故事与林晚星形成了平行对照——一个选择了学院道路，一个留在边境抗争。",
        coverImage: "",
        galleryImages: [],
        imageAltMap: {},
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["平民", "边境", "冲突"],
        relatedEntryIds: [DEMO_ENTRY_IDS.event, DEMO_ENTRY_IDS.faction],
        characterProfile: {
          displayName: "凯恩·铁砂",
          aliases: ["凯恩", "铁砂"],
          pronouns: "他",
          ageText: "22 岁",
          gender: "男",
          identity: "边境矿工 · 北境联盟支持者",
          factionId: "demo-entry-faction-northern",
          locationId: "",
          speciesId: "",
          appearance:
            "体格结实，皮肤因常年在矿区劳作而呈古铜色，手臂和手掌布满矿尘与旧伤痕。深色头发随意束在脑后，眼神坚毅但带着疲惫。穿着耐用的矿工皮甲，腰间挂着一小袋星银碎屑——那是他父亲留下的最后一点矿样。",
          personality:
            "寡言务实，不轻易信任外人，但对同伴绝对忠诚。在经历了巨大失去之后变得坚硬，但内心深处仍保留着对公正的渴望。不擅长言辞，却能用行动影响身边的人。",
          abilities:
            "从小在矿区长大，对星银矿脉的走向有近乎直觉的判断力。虽未受过正规符文学训练，但对星银的属性与使用方法有丰富的实践经验。擅长在矿区环境中快速判断安全风险。",
          goals:
            "为边境矿工争取更好的生存条件；揭露贵族与守序会在霜线冲突中的责任；让边境居民的苦难被更多人看见。",
          background:
            "凯恩的祖父是第一批在霜线矿区发现星银矿脉的矿工之一。他的家族三代以采矿为生，见证了矿区从繁荣到被贵族控制的全过程。\n\n星历 102 年，霜线冲突升级，凯恩的父亲和弟弟在一次贵族雇佣兵的突袭中丧生。他从此成为边境矿工互助组织「铁砂会」的核心人物。",
          trivia:
            "能用星银碎屑做简单的手工护符，虽然没有符文效力，但被边境居民视为保平安之物；对学院出身的符文学者本能地抗拒；但会对自己信任的人展示罕见的温柔。",
          statusText: "边境矿工 · 铁砂会组织者",
          quote: "矿石不会说谎，人却可以。",
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
        id: "demo-entry-location-outpost",
        projectId: DEMO_PROJECT_ID,
        type: "location",
        title: "霜线前哨",
        summary: "位于霜线矿区边缘的军事化前哨站，是边境冲突的前线与各方势力的交汇点。",
        content:
          "霜线前哨建于星历 890 年，最初是星落学院的野外观测站，后来因为霜线矿区的星银矿脉发现而逐渐转为军事化管理。\n\n前哨站由守序会与浮空岛议会共同管辖，但实际上守序会的执律人拥有最高指挥权。前哨东侧是矿区入口，西侧是通往边境聚落的唯一道路。\n\n星历 102 年秋的冲突之后，前哨站成为北境联盟与浮空岛势力对峙的最前沿。",
        coverImage: "",
        galleryImages: [],
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["边境", "冲突", "矿区"],
        relatedEntryIds: [DEMO_ENTRY_IDS.event, DEMO_ENTRY_IDS.faction],
        locationProfile: {
          locationCategory: "other",
          status: "active",
          parentLocationId: "",
          governingFactionId: DEMO_ENTRY_IDS.faction,
          environment:
            "霜线前哨位于浮空岛边缘的霜线矿区外围。气候寒冷干燥，常年有高空强风，夜间温度骤降。前哨建筑用深灰色矿石与星银合金加固，四周设有观测塔与警报符文阵。",
          landmarks:
            "矿脉入口：霜线矿区的唯一正式入口，设有矿石纯度检测符文。\n前哨指挥塔：守序会派驻的最高级别执律人办公室，可俯瞰整个矿区。\n边境通道：连接前哨与边境聚落的狭窄石桥，被当地人称为「霜线之喉」。",
          history:
            "前哨最初建于星历 890 年，是星落学院野外观测网络的一部分。星历 920 年发现大量星银矿脉后，守序会接管并改建为军事化前哨。此后每一次星落前后的矿脉波动期，这里都是冲突最激烈的地方。",
          access:
            "矿区作业时间外需要执律人许可才能进入。边境通道在冲突期间会被封锁，平民不得随意通行。星落前夕通常实施全面管制。",
          creatorNotes:
            "霜线前哨是「边境冲突·霜线」事件的主要舞台。建议在描写时突出其寒冷、荒凉、高度军事化的氛围，与星落学院的温暖优雅形成对比。",
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
        id: "demo-entry-faction-northern",
        projectId: DEMO_PROJECT_ID,
        type: "faction",
        title: "北境联盟",
        summary: "地表王国组成的军事同盟，主张浮空岛非法占有星银资源，是守序会的主要对立势力。",
        content:
          "北境联盟由三个地表王国在星历 750 年前后秘密结成，最初的目标是联合对抗浮空岛日益扩张的政治影响力。\n\n霜线矿区的发现使联盟找到了具体的斗争焦点——星银矿脉。联盟声称矿区自古以来属于地表，《云陆条约》是在浮空岛议会胁迫下签订的不平等条约。\n\n联盟并非完全邪恶——许多成员国在浮空岛崛起过程中确实失去了原有领土和资源。但在追求公正的过程中，联盟也犯下了暴力报复和间谍破坏等错误。",
        coverImage: "",
        galleryImages: [],
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["组织", "政治", "冲突"],
        relatedEntryIds: [DEMO_ENTRY_IDS.event, DEMO_ENTRY_IDS.faction],
        factionProfile: {
          factionCategory: "government",
          status: "active",
          parentFactionId: "",
          headquartersLocationId: "demo-entry-location-outpost",
          ideology:
            "主张「土地属于大地之子」。北境联盟的核心信念是地表文明拥有对星银矿脉的历史主权，浮空岛的统治是建立在非法掠夺之上的。联盟内部有温和派（主张谈判恢复矿权）和强硬派（主张武力夺回），目前强硬派占据上风。",
          structure:
            "联盟采用邦联制，三个成员国各有一席决策权，重大决定需至少两席同意。联盟设有常设军事指挥部和情报网络，但缺乏守序会那样严密的三阶体制，执行效率取决于成员国之间的协调程度。",
          influence:
            "联盟在边境地区有深厚的民众基础——许多失去土地的平民和矿工对联盟持同情态度。但在核心浮空岛地区几乎没有直接影响力。联盟通过渗透、走私和外交手段维持对霜线矿区的压力。",
          history:
            "北境联盟的前身是地表王国的松散互保协议。星历 750 年正式建盟，此后数次在浮空岛议会中提出矿权申诉均被驳回。星历 102 年的霜线冲突是联盟强硬派主导的首次武力试探，结果尚未分晓。",
          creatorNotes:
            "北境联盟的设计目标是使其成为守序会的对立方，但不要把它写成纯粹反派。它的诉求有部分正当性，手段中有激进成分。可以提供多方视点让冲突更立体。",
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
        loreProfile: {
          loreCategory: "magic_system",
          status: "stable",
          coreConcept:
            "「星落异象」是星落纪世界中周期性出现的超自然天象。每隔约七十年，夜空会洒落细碎光屑，导致局部地区魔力浓度短时间升高，并引发灵兽躁动、遗物共鸣与部分人物感知异常。",
          worldRules:
            "1. 星落期间，魔力并不是平均扩散，而是沿着古老地脉、遗迹和高塔附近聚集。\n" +
            "2. 光屑不会长期留存，通常会在数日内消散，但被遗物、灵兽或特殊体质者吸收后会留下残响。\n" +
            "3. 星落不会直接创造力量，而是放大已有的潜能、裂痕和未解决的因果。\n" +
            "4. 星落之后，世界往往进入一段不稳定时期，旧秩序会被重新审视。",
          cosmology:
            "传说星落来自世界外层的「星幕」。星幕并非真正的天空，而像是一层覆盖世界的古老屏障。每当星幕周期性松动，外层光屑便会穿透夜空落入大地。学者认为星落可能与远古文明遗留的观测塔有关，但这一解释尚未被完全证实。",
          historyOverview:
            "星落异象在星历纪元中多次出现。早期人们将其视为神迹，后来学院和各地组织逐渐将其记录为可观测的周期现象。最近一次星落发生在星历 102 年秋，直接引发了边境地区的灵兽迁徙和「霜线冲突」的升级。",
          magicSystem:
            "星落期间，魔法、灵性和遗物反应会明显增强。普通人可能只感到眩晕或梦境异常，而具备特殊感知能力的人会看到光屑中的「残响」。部分灵兽会被星落吸引并向高魔力区域迁徙。残响护符等物品可以短暂储存星落后的微弱回声。",
          technologyLevel:
            "当前世界尚未发展出完全解释星落的技术体系。星落学院等研究机构主要依靠观测塔、手抄星图、灵性仪器和遗物共鸣记录来追踪星落周期。不同地区对星落的理解差异很大，边境地区更多依靠经验和传说。",
          culture:
            "不同文化对星落有不同解释。学院派认为星落是自然现象，宗教团体将其视为启示，边境居民则把它看作危险前兆。许多地方会在星落之夜举行守夜仪式，也有人借机寻找遗物、捕捉灵兽或进行禁忌实验。",
          conflicts:
            "星落异象本身不是灾难，但它会放大世界中已有的矛盾。学院希望记录和研究，边境组织希望控制高魔力地点，民间团体则担心星落带来灾祸。当星落影响到灵兽迁徙、遗物苏醒和组织利益时，冲突就会迅速升级。",
          creatorNotes:
            "星落异象是 demo 世界的核心世界观规则，用来连接魔法体系、事件时间线、遗物、灵兽、学院和主角感知能力。它既可以作为背景设定，也可以作为推动剧情的周期性机制。",
          relatedLocationIds: [DEMO_ENTRY_IDS.location],
          relatedFactionIds: [DEMO_ENTRY_IDS.faction],
          relatedSpeciesIds: [DEMO_ENTRY_IDS.species],
          relatedEventIds: [DEMO_ENTRY_IDS.event],
          relatedItemIds: [DEMO_ENTRY_IDS.item],
        },
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
          participantCharacterIds: ["demo-entry-character-kane"],
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
        id: "demo-entry-event-trial",
        projectId: DEMO_PROJECT_ID,
        type: "event",
        title: "符文入学试·林晚星",
        summary: "林晚星参加星落学院入学符文测试的经过，在此事件中她首次公开展示了独特的符纹感知能力，并引起了艾拉导师与索林·维恩的注意。",
        content:
          "星历 97 年秋，星落学院一年一度的入学符文测试。来自浮空岛各地的年轻应试者聚集在学院符文大厅，在导师和观察官的注视下展示他们的符文学基础。\n\n林晚星作为边境出身、没有家族背景的应试者，从一开始就处于不利位置。她没有受过正规符文学训练，手中只有一本破旧的《基础符文通识》和几页自制的符纹笔记。\n\n在实际操作测试中，她的符纹感知能力第一次在公开场合显现——她能「看见」测试符文板上的魔力流动纹路，并以一种非传统但有效的方式激活了符阵。\n\n这次测试引起了艾拉导师的注意，她力排众议将林晚星破格录取。也在场的索林·维恩对此感到震惊，这成为他重新审视「天赋与出身」观念的起点。",
        coverImage: "",
        galleryImages: [],
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["学院", "符文学", "测试"],
        relatedEntryIds: [DEMO_ENTRY_IDS.location, DEMO_ENTRY_IDS.character],
        eventProfile: {
          eventCategory: "ceremony",
          status: "concluded",
          chronology: "星历纪元",
          startDateText: "星历 97 年秋",
          endDateText: "星历 97 年秋",
          locationId: DEMO_ENTRY_IDS.location,
          primaryFactionId: "",
          participantCharacterIds: [DEMO_ENTRY_IDS.character, "demo-entry-character-sorin", "demo-entry-character-elara"],
          involvedFactionIds: [DEMO_ENTRY_IDS.faction],
          relatedItemIds: [],
          cause:
            "星落学院每年秋季举行入学符文测试以筛选具有符文学天赋的学生。虽然学院声称面向所有浮空岛开放，但实际上测试偏向接受过前期训练的贵族和学院子弟。艾拉导师作为当年评审之一，注意到了林晚星的特异表现。",
          process:
            "测试分为理论笔试和实际符文操作两部分。林晚星在笔试中表现中规中矩，但在实际操作测试中展示了独特的「符纹感知」能力——她不需要接触符文板就能指出魔力流动的最弱点和最强点。她的激活方式与标准教科书不同但效果显著，引起了评审席上的争议。",
          result:
            "经过艾拉导师的推荐和评审组的投票，林晚星被破格录取为星落学院正式学生，成为近年最年轻的符文学徒之一。索林·维恩对结果表示异议但被驳回，这在他心中埋下了困惑的种子。",
          impact:
            "林晚星的录取在学院内部引起小范围讨论，部分贵族学生对此不满，但也有人对她的能力产生好奇。艾拉导师因此获得了推动平民招生的一个实际案例。索林开始重新思考自己家族教导的「天赋与血统对等」这一信念。",
          aftermath:
            "林晚星进入学院后成为艾拉导师的直属学生。她的能力在后续学习中持续增长，但也面临来自贵族同学的隐性排挤。入学试的争议在学院档案中留下了记号，后来守序会特地对她的档案进行了标注。",
          creatorNotes:
            "符文入学试是第一卷早期事件，可作为林晚星故事线的起点。与霜线冲突的大尺度政治事件形成对比，这是个人成长尺度的转折点。建议在 Timeline 中将此事件排在前面。",
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
        speciesProfile: {
          speciesCategory: "animal",
          status: "rare",
          habitatLocationId: DEMO_ENTRY_IDS.location,
          relatedFactionIds: [],
          representativeCharacterIds: [DEMO_ENTRY_IDS.character],
          appearance:
            "云栖狐体型接近家猫，体态轻盈，耳尖微向上翘。其尾毛呈半透明状，在星落期间会自行发出柔和的乳白色微光，如同裹了一层薄薄星尘。",
          physiology:
            "云栖狐能够敏锐感知魔力潮汐的细微变化，常在星落异象前夕表现出明显的焦躁或聚集行为。它们偏好栖息在浮空岛边缘与高空气流稳定的云林地带，以小型昆虫和灵性植物为食。",
          abilities:
            "感知魔力潮汐的流向与强度变化；在星落期间能与附近符纹产生短暂共鸣；有学院记录表明它们会主动引导迷路的旅人走向安全路径，这一行为的原因尚不明确。",
          culture:
            "云栖狐并非智慧种族，没有人类意义上的社会制度。它们以小型家族群为单位活动，有较固定的领地范围，群内存在以年长雌性为核心的亲缘协作行为。",
          history:
            "星落学院的早期观测记录中多次提及云栖狐与星落异象同时出现，有学者推测它们可能比浮空岛文明更早感知星落的征兆。",
          distribution:
            "主要分布在苍岚浮空岛边缘的云林地带、学院周边的高空草甸以及中央观星台附近的浮石区域。远离人烟的北部崖壁也有少量目击记录。",
          relationshipWithHumans:
            "民间视云栖狐为吉兆，传说它们在旅人迷路时会出现并指引方向。贵族曾一度试图捕获作为稀有宠物，此事引发争议后浮空岛议会已立法将其列为受保护物种。",
          creatorNotes:
            "云栖狐可作为章节间温柔调剂、预兆象征或关键引路线索使用，其与星落异象之间的隐秘联系可在第二卷逐渐展开。",
        },
      },
      {
        id: "demo-entry-lore-worldrule",
        projectId: DEMO_PROJECT_ID,
        type: "lore",
        title: "苍岚浮空岛世界规则",
        summary: "苍岚浮空岛世界的基本物理法则、浮空原理与魔力流动规律，是关于这个世界如何运作的核心设定。",
        content: "苍岚世界由数座悬浮于云海之上的浮空岛组成，其核心物理法则与地表世界存在多处根本性差异。\n\n浮空岛并非依靠常规重力悬浮，而是由深埋于岛屿基底的「星银矿脉」与大地之下的对偶矿脉之间产生的磁斥力所支撑。这种磁斥力在星落期间会短暂波动，导致部分小型浮岛出现位移或高度变化。\n\n魔力在苍岚世界并非均匀分布。它沿古老地脉、星银矿脉和古代观测塔遗址附近聚集，形成浓度不一的「魔力带」。浮空岛间的航行、符文学的实践、灵兽的迁徙路线都与这些魔力带的分布密切相关。",
        coverImage: "",
        galleryImages: [],
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["世界观", "世界规则"],
        relatedEntryIds: [DEMO_ENTRY_IDS.location, DEMO_ENTRY_IDS.lore],
        loreProfile: {
          loreCategory: "world_rule",
          status: "stable",
          coreConcept:
            "苍岚浮空岛是星落纪世界观的主要舞台，其物理法则以星银矿脉磁斥力为核心，魔力的流动与星落周期共同塑造了这个世界的基本运作方式。",
          worldRules:
            "1. 浮空原理：星银矿脉与对偶矿脉之间的磁斥力使岛屿悬浮，矿脉的纯度与厚度决定岛屿的高度与稳定性。\n2. 魔力带分布：魔力并非均匀扩散，而是沿地脉、矿脉和高塔附近聚集，形成浓度不一的条带状区域。\n3. 星落影响：星落期间磁斥力短暂波动，可能导致小型浮岛位移，也是新矿脉被发现的主要时机。\n4. 遗物残响：部分古代遗物能够在星落期间储存微弱的魔力回声，这一特性被称为「残响效应」。",
          cosmology:
            "苍岚世界的地质结构由多层矿脉交错构成，部分地区可以追溯到更早的时代。星银矿脉的形成与星落有关——每次星落都会在特定地点沉积新的矿层，因此浮空岛的矿脉纹路记录着星落的历史。",
          historyOverview:
            "浮空岛并非一开始就存在。根据《苍岚纪年》，远古时代大地完整，星银深埋地下。第一次星落后，部分陆地开始分离上升，形成最初的浮空岛。此后每一次星落都在重塑地形，有些岛屿诞生，有些岛屿坠毁。",
          magicSystem:
            "魔力来自星银矿脉与星落光屑的交互。符文学的实践建立在「符文即矿脉的微缩映射」这一理论上——符文学徒通过在介质上刻绘特定符文来引导附近的魔力流动。残响护符等遗物则能在星落期间被动储存魔力。",
          technologyLevel:
            "苍岚世界处于前工业文明与魔力技术混合的阶段。星落学院等研究机构以观测、记录和符文实验为主，尚未发展出系统化的科学理论。不同浮空岛之间的技术差距很大，核心岛屿掌握符文学与星图绘制，边境地区则更多依赖经验与传说。",
          culture:
            "浮空岛上的社会以浮空岛议会为最高协调机构，各主要岛屿有其自治权。星落学院在文化传承中扮演重要角色，但也被批评为「贵族的知识垄断」。平民阶层对星落的理解更多依赖口述传统与民间仪式。",
          conflicts:
            "浮空岛的世界规则实际上塑造了社会的不平等——矿脉最丰富的岛屿拥有最强的浮空稳定性与最多的符文学资源，而矿脉稀薄的边境岛屿则面临坠落风险与资源匮乏。这种结构性不平等是许多政治冲突的根源。",
          creatorNotes:
            "这一条目是苍岚世界的基础规则设定，应与其他 lore 条目（历史文化、宇宙观、冲突）配合使用。在写作中建议保持「星银矿脉」的核心设定一致性。",
          relatedLocationIds: [DEMO_ENTRY_IDS.location, DEMO_ENTRY_IDS.observatory],
          relatedFactionIds: [DEMO_ENTRY_IDS.faction],
          relatedSpeciesIds: [],
          relatedEventIds: [DEMO_ENTRY_IDS.event],
          relatedItemIds: [DEMO_ENTRY_IDS.item],
        },
      },
      {
        id: "demo-entry-lore-cosmology",
        projectId: DEMO_PROJECT_ID,
        type: "lore",
        title: "星幕与古代遗迹",
        summary: "覆盖世界外层的神秘屏障——星幕，以及散布在浮空岛上的古代观测塔遗迹，是理解星落异象起源的关键线索。",
        content: "星幕是苍岚世界中一个古老而神秘的设定。它并非真正的天空，而是一层半透明的屏障，将浮空岛世界与外界隔开。\n\n远古文明留下的观测塔被认为与星幕有关。这些塔并非用于防御或居住，而是用于监测星幕的波动，并在星落前夕发出预警。\n\n目前已知的观测塔分布在星落学院地下、中央观星台以及北部崖壁。守序会封锁了部分塔址，外界难以探知全部真相。",
        coverImage: "",
        galleryImages: [],
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["世界观", "宇宙观", "遗迹"],
        relatedEntryIds: [DEMO_ENTRY_IDS.location, DEMO_ENTRY_IDS.observatory, DEMO_ENTRY_IDS.lore],
        loreProfile: {
          loreCategory: "cosmology",
          status: "stable",
          coreConcept:
            "星幕是一层覆盖世界的古老屏障，周期性松动导致星落异象。古代观测塔是远古文明用于监测星幕波动的遗迹，其分布与星落的规律密切相关。",
          worldRules:
            "星幕并非物理天空，而是一层具有周期性波动特征的屏障。星落期间星幕出现裂缝，光屑从中洒落。观测塔与星幕之间存在未知的联系——塔内的某些结构能够与星幕共振。",
          cosmology:
            "星幕的起源尚无定论。一种假说认为它是远古文明在灾难之后为了保护幸存者而建造的；另一种假说认为它是自然形成的。观测塔在苍岚世界共有约七座已知遗址，其中三座已被发现，其余位置仅存在于古代文献的记载中。",
          historyOverview:
            "对星幕的研究始于星落学院建立之初。第一批星象学者通过持续观测发现星幕的周期并非固定七十年，而是在六十五到七十五年之间波动。观测塔的存在直到近百年才被确认——星落学院地底封存库的发掘揭示了第一座完整塔址。",
          magicSystem:
            "观测塔本身不具备主动的魔法功能，但塔内的石质结构与特定符文会产生共振效应。在星落前夕，观测塔内部的特定石板会微微发光，被认为是最早的星落预警装置。符文学中部分高级符文直接来源于观测塔内壁的刻痕。",
          technologyLevel:
            "当前的观测技术主要依靠手抄星图和灵性仪器。星落学院的地底封存库保存着部分古代观测设备，但大部分已经损坏。守序会掌握的几座塔址中，据传仍有部分结构能够运作。",
          culture:
            "古代观测塔在民间传说中被神化。边境居民相信塔内居住着守护星幕的灵体，学院学者则将其视为需要保护的研究资源。守序会对塔址的封锁引发了学术界的争议——许多学者认为这些塔应当是公共研究资源。",
          conflicts:
            "观测塔的控制权是学院与守序会之间的潜在冲突点。守序会认为塔址可能隐藏危险，应当严密封锁；学院则主张开放研究以理解星幕的规律。边境地区的新塔址发现往往伴随着政治角力。",
          creatorNotes:
            "星幕与观测塔是主线剧情中的重要伏笔。建议不要让塔址的全部秘密过早揭晓，保持神秘感。北部崖壁的塔址可以作为第二卷的探索目标。",
          relatedLocationIds: [DEMO_ENTRY_IDS.location, DEMO_ENTRY_IDS.observatory],
          relatedFactionIds: [DEMO_ENTRY_IDS.faction],
          relatedSpeciesIds: [],
          relatedEventIds: [],
          relatedItemIds: [DEMO_ENTRY_IDS.item],
        },
      },
      {
        id: "demo-entry-lore-history",
        projectId: DEMO_PROJECT_ID,
        type: "lore",
        title: "星历纪元历史概览",
        summary: "从第一次星落到当前时代的千年历史脉络，包括关键事件、时代划分与主要文明变迁。",
        content: "星历纪元始于第一次有记载的星落事件。\n\n根据《苍岚纪年》的记录，星历元年前夕，苍岚大地完整，星银深埋地下。第一次星落改写了整个世界的物理格局——部分陆地上升成为浮空岛，星银矿脉首次暴露于地表。\n\n此后约每七十年一次的星落周期成为划分时代的主要依据。每个时代都有其标志性事件：第二次星落后浮空岛议会的成立、第五次星落后符文学的诞生、第十次星落后星落学院的建立。\n\n最近一次星落发生在星历 102 年，也是第十二次。",
        coverImage: "",
        galleryImages: [],
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["世界观", "历史"],
        relatedEntryIds: [DEMO_ENTRY_IDS.location, DEMO_ENTRY_IDS.lore],
        loreProfile: {
          loreCategory: "history",
          status: "stable",
          coreConcept:
            "星历纪元以星落周期为时间轴，十二次星落事件划分了苍岚世界的历史。每一次星落不仅改变物理格局，也重塑政治秩序与文化走向。",
          worldRules: "",
          cosmology: "",
          historyOverview:
            "星历纪元前：大地完整，文明以地表王国为主，星银矿脉深埋地下。\n星历 0 年：第一次星落。部分陆地上升为浮空岛，星银首次暴露，地表文明遭受重创。\n星历 140 年：第二次星落。浮空岛议会成立，确立「一岛一票」的议事原则。\n星历 350 年：第五次星落。符文学诞生，第一批符文被系统化记录。\n星历 560 年：第八次星落。守序会成立，起初为应急组织。\n星历 700 年：第十次星落。星落学院正式建立，成为符文学与星象学的研究中心。\n星历 910 年：第十二次星落（最近一次）。边境冲突升级，「霜线」争端爆发。",
          magicSystem:
            "符文学的演变与星落周期紧密相关。每次星落后都会出现新的符文变体，学者们至今无法确定这是星落本身的效应，还是研究者在新环境下做出了不同的解读。",
          technologyLevel:
            "星历纪元的文明经历了从地表王国到浮空岛文明的迁移。早期以农业和基础贸易为主，符文学诞生后开始出现与魔力技术混合的产业。星落学院的建立标志着知识体系的学院化。",
          culture:
            "星历纪元的时代划分本身是一种文化建构。不同浮空岛对时代的命名和意义赋予存在差异——核心岛屿倾向于强调议会与学院的历史，边境地区则更多以灾难和抗争为叙事主线。",
          conflicts:
            "历史的书写本身就是冲突。议会版本的《苍岚纪年》与边境地区的口述传统之间存在多处矛盾。守序会介入历史记录的审查问题长期存在争议。",
          creatorNotes:
            "建议以此为背景参考，在写作中保持一致的时代划分。具体事件细节可根据剧情需要调整，但星落的周期性规则建议不要轻易更改。",
          relatedLocationIds: [DEMO_ENTRY_IDS.location],
          relatedFactionIds: [DEMO_ENTRY_IDS.faction],
          relatedSpeciesIds: [],
          relatedEventIds: [DEMO_ENTRY_IDS.event],
          relatedItemIds: [],
        },
      },
      {
        id: "demo-entry-lore-culture",
        projectId: DEMO_PROJECT_ID,
        type: "lore",
        title: "苍岚浮空岛文化体系",
        summary: "浮空岛社会中不同阶层、地区的文化传统、价值观差异与生活方式，以及星落文化在民间的表现形态。",
        content: "浮空岛文化并非单一体系。核心岛屿如苍岚主岛以学院文化为主导，重视符文学、星象观测与议会政治。边境浮空岛则保留着更多地表王国时代的传统——包括口头叙事、岁时仪式与地方信仰。\n\n星落文化是贯穿所有地区和阶层的一条主线。星落之夜被称为「星夜」，各岛屿都有自己的星夜仪式：学院举行观测晚宴，边境居民则在屋顶点燃星银粉末，祈求平安度过魔力潮汐期。\n\n贵族与平民之间的文化差异显著。贵族掌握符文学和星图知识，平民则更多依赖经验与传说。这种知识分层是许多社会矛盾的根源。",
        coverImage: "",
        galleryImages: [],
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["世界观", "文化", "社会"],
        relatedEntryIds: [DEMO_ENTRY_IDS.location, DEMO_ENTRY_IDS.faction, DEMO_ENTRY_IDS.lore],
        loreProfile: {
          loreCategory: "culture",
          status: "stable",
          coreConcept:
            "苍岚浮空岛是一个多元文化并存的社会，以学院文化和星落文化为两大支柱。贵族与平民、核心岛与边境地区之间的文化差异是社会结构的核心特征之一。",
          worldRules: "",
          cosmology: "",
          historyOverview:
            "浮空岛文化的形成经历了从地表王国到悬浮社会的转变。早期浮空岛居民主要是地表灾难的幸存者，携带了各自的文化传统。随着时间推移，独特的浮空岛文化逐渐形成——以星落为周期的岁时体系、以矿脉为依托的经济结构、以议会和学院为核心的社会组织。",
          magicSystem: "",
          technologyLevel: "",
          culture:
            "学院文化：以星落学院为中心，重视学术研究、符文学训练和星象观测。学院出身的人在议会和守序会中占有重要职位。\n边境文化：以家族和聚落为基础，保留了更多地表时代的传统，对学院和议会的权威持保留态度。星夜仪式、聚落集会、口头传承是边境文化的主要形式。\n贵族文化：掌握核心矿脉与符文学知识，在政治和经济上占据优势地位。贵族子弟多就读于星落学院。\n平民文化：依赖手工艺、贸易和季节性劳动为生。对星落的认知以实用经验为主。",
          conflicts:
            "文化分层带来的冲突主要体现在：知识的垄断（贵族 vs 平民对符文学的接触权）、资源的分配（核心岛 vs 边境的矿脉占有）、文化的正当性（学院派 vs 民间传统的合法性之争）。",
          creatorNotes:
            "文化体系条目为角色背景和情节设计提供参考。建议在写作中根据不同角色出身展现不同文化视角，增加世界的立体感。",
          relatedLocationIds: [DEMO_ENTRY_IDS.location],
          relatedFactionIds: [DEMO_ENTRY_IDS.faction],
          relatedSpeciesIds: [DEMO_ENTRY_IDS.species],
          relatedEventIds: [],
          relatedItemIds: [],
        },
      },
      {
        id: "demo-entry-lore-conflict",
        projectId: DEMO_PROJECT_ID,
        type: "lore",
        title: "核心冲突：贵族与平民",
        summary: "浮空岛社会中最深层的社会矛盾——贵族与平民在知识、资源与政治权利上的长期对立，以及星落周期如何加剧这种张力。",
        content: "苍岚浮空岛社会最核心的冲突不是国与国之间，也不是人类与灵兽之间，而是贵族与平民之间的长期结构性对立。\n\n贵族阶层掌握着星银矿脉、符文学知识和议会席位。平民阶层虽然占人口的多数，但在政治决策中几乎没有话语权。\n\n星落周期会周期性地加剧这种矛盾。星落期间，新矿脉的发现往往首先被贵族控制，而边境地区因矿脉稀薄面临的安全风险则由平民独自承担。\n\n守序会虽然以中立自居，但其领导层多来自贵族背景。学院虽然破格录取了部分平民学生（如林晚星），但整体氛围仍然偏向贵族。",
        coverImage: "",
        galleryImages: [],
        createdAt: projectCreated,
        updatedAt: now,
        isFavorite: false,
        isPinned: false,
        tags: ["世界观", "冲突", "政治", "社会"],
        relatedEntryIds: [DEMO_ENTRY_IDS.faction, DEMO_ENTRY_IDS.character, DEMO_ENTRY_IDS.event],
        loreProfile: {
          loreCategory: "conflict",
          status: "stable",
          coreConcept:
            "贵族与平民之间的结构性对立是苍岚浮空岛社会的核心矛盾。知识的垄断、资源的分配不均与政治权利的失衡构成了冲突的基础，星落周期则周期性地放大这些矛盾。",
          worldRules: "",
          cosmology: "",
          historyOverview:
            "浮空岛社会的不平等并非自然形成，而是历史演变的结果。早期浮空岛居民在灾难后相对平等，但随着矿脉的发现和符文学的诞生，掌握矿脉和知识的家族逐渐崛起为贵族阶层。议会制度的「一岛一票」原则在实际上被核心岛屿主导，边境岛屿的诉求长期被忽视。",
          magicSystem:
            "符文学的知识垄断是冲突的核心之一。贵族家族控制着符文的核心典籍与教学方法，平民子弟除非展现出极高天赋（如林晚星），否则几乎没有接触符文学的机会。残响护符等遗物的研究也被限制在学院内部。",
          technologyLevel: "",
          culture: "",
          conflicts:
            "当前冲突的三大主线：\n1. 知识垄断：符文学的学习机会不均等，引发了平民学者团体的抗议。\n2. 资源分配：新发现矿脉的开发权几乎总是落入贵族手中，边境岛屿的安全风险却被均匀分摊。\n3. 政治代表权：议会制度名义上平等，实际上核心岛屿掌握了绝大多数票数。\n星落期间的「霜线冲突」是这些矛盾的集中爆发——矿区归属权之争背后是贵族与边境平民之间的长期积怨。",
          creatorNotes:
            "贵族与平民的冲突是多个角色和事件线的底层驱动力。林晚星作为平民出身的符文学徒，天然处于这个冲突的交汇点。建议在主线中保持这一矛盾的灰色性——不是所有贵族都是恶人，也不是所有平民都无私。",
          relatedLocationIds: [DEMO_ENTRY_IDS.location],
          relatedFactionIds: [DEMO_ENTRY_IDS.faction],
          relatedSpeciesIds: [],
          relatedEventIds: [DEMO_ENTRY_IDS.event],
          relatedItemIds: [],
        },
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
