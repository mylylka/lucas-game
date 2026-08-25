(function () {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const miniMap = document.getElementById("miniMapCanvas");
  const miniCtx = miniMap ? miniMap.getContext("2d") : null;
  const cipherStatusReadout = document.getElementById("cipherStatusReadout");
  const hunterPresenceBadge = document.getElementById("hunterPresenceBadge");
  const survivorStatusGrid = document.getElementById("survivorStatusGrid");
  const quickChat = document.getElementById("quickChat");
  const quickChatToggle = document.getElementById("quickChatToggle");
  const quickChatMenu = document.getElementById("quickChatMenu");
  const quickChatTargetReadout = document.getElementById("quickChatTargetReadout");
  const cooldownPanel = document.getElementById("cooldownPanel");
  const touchStick = document.getElementById("touchStick");
  const touchKnob = document.getElementById("touchKnob");
  const touchUseButton = document.getElementById("touchUseButton");
  const touchInteractButton = document.getElementById("touchInteractButton");
  const touchAttackButton = document.getElementById("touchAttackButton");
  const touchSkillButton = document.getElementById("touchSkillButton");
  const touchShadowButton = document.getElementById("touchShadowButton");
  const touchActorPhantomButton = document.getElementById("touchActorPhantomButton");
  const touchGhostfireButton = document.getElementById("touchGhostfireButton");
  const roleOverlay = document.getElementById("roleOverlay");
  const characterCodexButton = document.getElementById("characterCodexButton");
  const characterCodexOverlay = document.getElementById("characterCodexOverlay");
  const characterCodexClose = document.getElementById("characterCodexClose");
  const characterCodexList = document.getElementById("characterCodexList");
  const characterCodexDetail = document.getElementById("characterCodexDetail");
  const characterCodexTabs = document.querySelectorAll("[data-codex-role]");
  const roleActions = document.getElementById("roleActions");
  const roleDialogTitle = document.getElementById("roleDialogTitle");
  const characterPanel = document.getElementById("characterPanel");
  const characterBackButton = document.getElementById("characterBackButton");
  const characterNextButton = document.getElementById("characterNextButton");
  const hiddenUnlockForm = document.getElementById("hiddenUnlockForm");
  const hiddenCodeInput = document.getElementById("hiddenCodeInput");
  const badgePanel = document.getElementById("badgePanel");
  const badgeLimitReadout = document.getElementById("badgeLimitReadout");
  const kiteSimulatorOptions = document.getElementById("kiteSimulatorOptions");
  const kiteSimulatorNoCooldownButton = document.getElementById("kiteSimulatorNoCooldownButton");
  const assistPanel = document.getElementById("assistPanel");
  const assistLimitReadout = document.getElementById("assistLimitReadout");
  const hunterSurvivorPreview = document.getElementById("hunterSurvivorPreview");
  const roleButtons = document.querySelectorAll("[data-role]");
  const modeButtons = document.querySelectorAll("[data-mode]");
  const characterButtons = document.querySelectorAll("[data-character]");
  const badgeButtons = document.querySelectorAll("[data-badge]");
  const assistButtons = document.querySelectorAll("[data-assist]");
  let survivorStatusHtml = "";
  const HIDDEN_HUNTER_UNLOCK_KEY = "asymmetricChase.hiddenHunterUnlocked";
  const HIDDEN_HUNTER_UNLOCK_CODE = "jianxian";
  const DEVELOPER_MODE_QUERY_KEY = "dev";

  const PLAYER_ROLE = {
    survivor: "survivor",
    hunter: "hunter"
  };

  const GAME_MODE = {
    normal: "normal",
    infiniteSawbone: "infiniteSawbone",
    soulBinderPractice: "soulBinderPractice",
    kiteSimulator: "kiteSimulator"
  };

  const KITE_SIMULATOR_PLAYER_COOLDOWN_FIELDS = [
    "nextPackageAt",
    "nextNavigationChannelAt",
    "nextNavigationChannelRideAt",
    "nextTimeRewindAt",
    "nextMagicShowAt",
    "nextRescuePhantomAt",
    "nextStitchPackAt",
    "nextPerfumeMistAt",
    "nextTunerEchoAt",
    "nextTunerCipherTuneAt",
    "nextFencerLungeAt",
    "nextAntiqueSweepLeftAt",
    "nextAntiqueThrustAt",
    "nextAntiqueSweepRightAt",
    "nextAntiqueLeapAt",
    "nextAntiqueSprintAt",
    "nextMedicAdrenalineAt",
    "nextFlywheelAt",
    "nextKneeJerkWindowAt",
    "nextKneeJerkPalletAt",
    "nextGeneralRideAt",
    "nextGeneralWhipAt",
    "nextShieldGuardAt",
    "nextFighterPunchAt"
  ];

  const BADGE_LIMITS = {
    purple: 2,
    blue: 4
  };
  const BADGE_CONFIG = {
    survivor: {
      cipher: { name: "齿轮", rarity: "blue", repairDuration: 0.94 },
      kite: { name: "羽步", rarity: "blue", vaultDuration: 0.93, hitBoostDuration: 1.12 },
      aid: { name: "援护", rarity: "blue", rescueDuration: 0.9, healPower: 1.12 },
      ember: { name: "余火", rarity: "blue", crawlSpeed: 1.22, hitBoostDuration: 1.08 },
      physicianBenevolence: { name: "医者仁心", rarity: "blue" },
      adrenaline: { name: "回光返照", rarity: "purple", endgameBoost: 1.5 },
      borrowedTime: { name: "搏命挣扎", rarity: "purple" },
      flywheel: { name: "飞轮效应", rarity: "purple" },
      kneeJerk: { name: "膝跳反射", rarity: "purple" }
    },
    hunter: {
      detention: { name: "挽留", rarity: "purple", detention: 1 },
      rampage: { name: "张狂", rarity: "purple" },
      trumpCard: { name: "底牌切换", rarity: "purple" },
      confinedSpace: { name: "禁闭空间", rarity: "purple" },
      wanted: { name: "通缉", rarity: "blue" },
      hunt: { name: "猎步", rarity: "blue", speed: 1.035 },
      blade: { name: "锋刃", rarity: "blue", attackRange: 1.06 },
      pressure: { name: "压迫", rarity: "blue", chairSpeed: 1.08 },
      wipe: { name: "收刀", rarity: "blue", hitRecovery: 0.93, missRecovery: 0.9 },
      criticalPoint: { name: "临界点", rarity: "blue" }
    }
  };
  const HUNTER_ASSIST_SKILLS = {
    listen: { name: "聆听", cooldown: 42000 },
    peeper: { name: "插眼", cooldown: 50000 },
    abnormal: { name: "失常", cooldown: 45000 },
    patroller: { name: "巡视者", cooldown: 62000 },
    blink: { name: "闪现", cooldown: 55000 },
    shift: { name: "移形", cooldown: 68000 },
    excitement: { name: "兴奋", cooldown: 52000 }
  };
  const HUNTER_ASSIST_ORDER = ["listen", "peeper", "abnormal", "patroller", "blink", "shift", "excitement"];

  const SURVIVOR_CHARACTERS = {
    clockmaker: {
      name: "钟表匠",
      roleTag: "修机位",
      rescuePriority: 4,
      chaseDifficulty: 0.92,
      repairDuration: 0.76,
      vaultDuration: 1.16,
      rescueDuration: 1,
      healPower: 1,
      crawlSpeed: 1,
      hitBoostDuration: 1,
      fill: "#e9efe6",
      core: "#d9b76a"
    },
    actor: {
      name: "演员",
      roleTag: "救人位",
      rescuePriority: 1,
      chaseDifficulty: 1.12,
      repairDuration: 1,
      vaultDuration: 0.95,
      rescueDuration: 0.9,
      healPower: 1,
      crawlSpeed: 1,
      hitBoostDuration: 1.15,
      fill: "#f0cfb7",
      core: "#c87f55"
    },
    messenger: {
      name: "信使",
      roleTag: "牵制位",
      rescuePriority: 2,
      chaseDifficulty: 1.38,
      repairDuration: 1.2,
      vaultDuration: 0.66,
      rescueDuration: 1,
      healPower: 1,
      crawlSpeed: 1,
      hitBoostDuration: 1,
      fill: "#c9d6f2",
      core: "#6d8fd4"
    },
    apprentice: {
      name: "学徒",
      roleTag: "辅助位",
      rescuePriority: 3,
      chaseDifficulty: 0.96,
      repairDuration: 1,
      vaultDuration: 1,
      rescueDuration: 1,
      healPower: 1,
      crawlSpeed: 1,
      hitBoostDuration: 1,
      fill: "#b7d6c1",
      core: "#5aa475"
    },
    navigator: {
      name: "引航员",
      roleTag: "辅助位",
      rescuePriority: 3,
      chaseDifficulty: 1,
      repairDuration: 1,
      vaultDuration: 0.98,
      rescueDuration: 1,
      healPower: 1,
      crawlSpeed: 1,
      hitBoostDuration: 1,
      fill: "#d8edf0",
      core: "#3a8c98"
    },
    medic: {
      name: "军医",
      roleTag: "救人位",
      rescuePriority: 1,
      chaseDifficulty: 1.08,
      repairDuration: 1.2,
      vaultDuration: 1,
      rescueDuration: 1 / 1.4,
      healPower: 1.08,
      crawlSpeed: 1,
      hitBoostDuration: 1,
      fill: "#e7f2ef",
      core: "#3d9f8b"
    },
    perfumer: {
      name: "调香师",
      roleTag: "辅助位",
      rescuePriority: 2,
      chaseDifficulty: 1.24,
      repairDuration: 1,
      vaultDuration: 0.96,
      rescueDuration: 1,
      healPower: 1,
      crawlSpeed: 1,
      hitBoostDuration: 1,
      fill: "#cfefff",
      core: "#4f9bd8"
    },
    fencer: {
      name: "击剑手",
      roleTag: "牵制位",
      rescuePriority: 2,
      chaseDifficulty: 1.32,
      repairDuration: 1,
      vaultDuration: 0.94,
      rescueDuration: 1,
      healPower: 1,
      crawlSpeed: 1,
      hitBoostDuration: 1,
      fill: "#e8eef5",
      core: "#6e8fcf"
    },
    fighter: {
      name: "格斗家",
      roleTag: "救人位",
      rescuePriority: 1,
      chaseDifficulty: 1.12,
      repairDuration: 1.5,
      vaultDuration: 1,
      rescueDuration: 0.92,
      healPower: 1,
      crawlSpeed: 1,
      hitBoostDuration: 1,
      fill: "#d9c5aa",
      core: "#9f5a38"
    },
    antiqueDealer: {
      name: "古董商",
      roleTag: "隐藏辅助位",
      rescuePriority: 2,
      chaseDifficulty: 1.18,
      repairDuration: 1,
      vaultDuration: 1,
      rescueDuration: 1,
      healPower: 1,
      crawlSpeed: 1,
      hitBoostDuration: 1,
      fill: "#ddd1a1",
      core: "#8b6239"
    },
    general: {
      name: "将军",
      roleTag: "救人位",
      rescuePriority: 1,
      chaseDifficulty: 1.22,
      repairDuration: 1.06,
      vaultDuration: 1,
      rescueDuration: 1,
      healPower: 1,
      crawlSpeed: 1,
      hitBoostDuration: 1,
      fill: "#4f6044",
      core: "#d1b06a"
    },
    shieldBearer: {
      name: "大盾手",
      roleTag: "牵制位",
      rescuePriority: 2,
      chaseDifficulty: 1.18,
      repairDuration: 1,
      vaultDuration: 1.15,
      rescueDuration: 1,
      healPower: 1,
      crawlSpeed: 1,
      hitBoostDuration: 1,
      fill: "#546778",
      core: "#d7c39a"
    },
    tuner: {
      name: "调律师",
      roleTag: "修机位",
      rescuePriority: 4,
      chaseDifficulty: 1.05,
      repairDuration: 0.9,
      vaultDuration: 1.06,
      rescueDuration: 1.08,
      healPower: 1,
      crawlSpeed: 1,
      hitBoostDuration: 1,
      fill: "#e7d9f2",
      core: "#9b76c8"
    }
  };

  const HUNTER_CHARACTERS = {
    standard: {
      name: "驯犬师",
      speed: 302,
      attackRange: 92,
      attackWindup: 0.14,
      attackLunge: 52,
      hitRecovery: 1,
      missRecovery: 1,
      vaultDuration: 1,
      fill: "#304638",
      core: "#d5b66f"
    },
    brute: {
      name: "震锤者",
      speed: 294,
      attackRange: 112,
      attackWindup: 0.23,
      attackLunge: 38,
      hitRecovery: 1.16,
      missRecovery: 1.08,
      vaultDuration: 1.08,
      fill: "#56372f",
      core: "#d7a35f"
    },
    lanternKeeper: {
      name: "提灯人",
      speed: 298,
      attackRange: 92,
      attackWindup: 0.12,
      attackLunge: 54,
      hitRecovery: 1,
      missRecovery: 1,
      vaultDuration: 1,
      fill: "#b95f52",
      core: "#ffd5cd"
    },
    sawbone: {
      name: "锯骨",
      speed: 300,
      attackRange: 96,
      attackWindup: 0.16,
      attackLunge: 52,
      hitRecovery: 1.04,
      missRecovery: 1,
      vaultDuration: 1,
      fill: "#d8d0bd",
      core: "#8f4f45"
    },
    soulBinder: {
      name: "引魂师",
      speed: 302,
      attackRange: 94,
      attackWindup: 0.15,
      attackLunge: 54,
      hitRecovery: 1,
      missRecovery: 1,
      vaultDuration: 1,
      fill: "#d8d0bd",
      core: "#7453a8"
    },
    mirrorGhost: {
      name: "镜鬼",
      speed: 306,
      attackRange: 92,
      attackWindup: 0.14,
      attackLunge: 52,
      hitRecovery: 1,
      missRecovery: 1,
      vaultDuration: 1,
      fill: "#0c2538",
      core: "#65c9ff"
    },
    dancer: {
      name: "舞者",
      speed: 304,
      attackRange: 94,
      attackWindup: 0.14,
      attackLunge: 50,
      hitRecovery: 1,
      missRecovery: 1,
      vaultDuration: 1,
      fill: "#3d254d",
      core: "#f0b6e8"
    },
    edictor: {
      name: "禁令官",
      speed: 302,
      attackRange: 92,
      attackWindup: 0.14,
      attackLunge: 52,
      hitRecovery: 1,
      missRecovery: 1,
      vaultDuration: 1,
      fill: "#273247",
      core: "#d7b46a"
    },
    abyss: {
      name: "“深渊”",
      speed: 302,
      attackRange: 96,
      attackWindup: 0.14,
      attackLunge: 52,
      hitRecovery: 1,
      missRecovery: 1,
      vaultDuration: 1,
      fill: "#163c43",
      core: "#80c2bd"
    },
    twinSword: {
      name: "双生剑仙",
      speed: 316,
      attackRange: 130,
      attackWindup: 0.1,
      attackLunge: 24,
      hitRecovery: 0.67,
      missRecovery: 0.86,
      vaultDuration: 0.86,
      fill: "#d7efff",
      core: "#8f7dff"
    }
  };

  const CHARACTER_GUIDE = {
    [PLAYER_ROLE.survivor]: {
      clockmaker: {
        style: "银白工装与金色怀表，局内以钟表匠 Q 版造型呈现。",
        overview: "修机效率极高，适合把一台关键密码机快速做完，再靠回溯撤离危险位置。",
        attack: "无普攻刀气。基础修机时长为常规的 76%，翻窗略慢。",
        skills: [
          { key: "被动", name: "精准校准", description: "修机校准更苛刻但收益更高；普通与完美校准依次推进密码机。" },
          { key: "Q", name: "回溯装置", description: "放置时间装置，10 秒内可回到放置点；回溯后获得 2 秒加速和 3 秒隐身。冷却 30 秒。" }
        ]
      },
      actor: {
        style: "暖橙舞台服与戏法道具，局内使用演员 Q 版造型。",
        overview: "偏救援与扰乱，能在椅前制造空档或转移椅上队友，适合读监管出刀节奏。",
        attack: "无普攻刀气。救援速度提高，受击后有短暂隐身与移速加成。",
        skills: [
          { key: "被动", name: "表演本能", description: "受击后短暂隐身并获得移速提升，可借此拉开距离或回头救援。" },
          { key: "Q", name: "魔术秀", description: "施放幻象进行扰乱或转移椅上队友；可用 F 切换救援和牵制用法。冷却 25 秒。" },
          { key: "M", name: "救援幻影", description: "按住拖拽选择较近落点，召唤与演员本体一致的幻影，持续 10 秒。其他队友上椅后，幻影会冲向椅子并完成一次救援；也可挡在队友前承受 1 点伤害。冷却 50 秒。" }
        ]
      },
      messenger: {
        style: "蓝白邮差装束与邮包，局内使用信使 Q 版造型。",
        overview: "板窗能力突出，可用邮包打断牵人并承担护航、扛刀任务。",
        attack: "无普攻刀气。翻越速度快，适合在板窗区持续牵制。",
        skills: [
          { key: "Q", name: "邮包", description: "向前投掷邮包，最远约 620 距离。命中追捕者眩晕 1.5 秒；投出后自身会后退一段距离。冷却 22 秒。" },
          { key: "救援强化", name: "气球救援", description: "邮包成功打断牵人或放下被牵者时，队友获得 15 秒一层护盾；护盾吃刀会让追捕者擦刀 2 秒。被追击时邮包命中可返还 8 秒冷却。" }
        ]
      },
      apprentice: {
        style: "草绿学徒装与针线包，局内使用学徒 Q 版造型。",
        overview: "稳定的续航辅助，提前布置针线包能把队友从后续治疗中解放出来。",
        attack: "无普攻刀气。各项基础交互均衡。",
        skills: [
          { key: "Q", name: "针线包", description: "放置针线包，受伤队友拾取后会在 15 秒后获得治疗。冷却 20 秒。" }
        ]
      },
      navigator: {
        style: "深蓝航海服、地图、罗盘与绳结，局内使用下载的新立绘。",
        overview: "路径辅助位。通过预先设定航道起点和方向，为全队提供可反复使用的定向转点。",
        attack: "无普攻刀气。基础交互均衡，翻越略快。",
        skills: [
          { key: "Q 第一次", name: "选定航道", description: "按住拖拽选定航道起点，松开后锁定该点。" },
          { key: "Q 第二次", name: "确认方向", description: "再次按住并从起点拖出方向；松开后生成一条永久航道。队友可选择按 E 驶入，沿方向快速滑行 5 格，直至追捕者拆除。" },
          { key: "E", name: "借道", description: "引航员站在自己的航道上可按 E 触发滑行，独立冷却 20 秒；其他队友站在航道内也可自行按 E 驶入，没有独立冷却。追捕者靠近航道按 Space 读条 1 秒可拆除。滑行不穿墙、窗或板，受击会中断且没有无敌。" }
        ]
      },
      medic: {
        style: "白绿军医制服与急救标识，局内使用军医 Q 版造型。",
        overview: "强救援位，擅长把队友从椅前安全带走，并用护盾换取拉开距离的时间。",
        attack: "无普攻刀气。救援速度显著提高，治疗效率略高。",
        skills: [
          { key: "被动", name: "战地救护", description: "救下队友后给予前线护盾；护盾承受一次伤害会击退追捕者并使其眩晕 3 秒。" },
          { key: "被动", name: "应急撤离", description: "每局首次成为追捕目标并进入心跳范围时，获得 3 秒 15% 移速。" },
          { key: "Q", name: "肾上腺素", description: "自身获得 6 秒 40% 加速并延后结算伤害，适合强行进椅或带人冲出危险区域。冷却 20 秒。" }
        ]
      },
      perfumer: {
        style: "浅蓝调香礼服与香雾瓶，局内使用调香师 Q 版造型。",
        overview: "区域辅助与转点牵制兼备，可用香雾压低监管追击效率并保护队友走位。",
        attack: "无普攻刀气。可在远、中距离感知追捕者接近。",
        skills: [
          { key: "被动", name: "嗅感预警", description: "追捕者靠近时提供分级预警，帮助自己和队友提前转点。" },
          { key: "Q", name: "迷香", description: "释放持续 10 秒的香雾，追捕者穿过会减速；每名队友首次进入该团香雾可隐身 5 秒。冷却 20 秒。" },
          { key: "F", name: "幻香大阵", description: "累积 4 次香雾后可点燃大范围幻香，提供更长时间的区域掩护与队友移速增益。" }
        ]
      },
      fencer: {
        style: "深蓝击剑服与细剑，局内使用击剑手 Q 版造型。",
        overview: "高操作牵制位，通过连续转向积累健步，再用突刺穿过监管的攻击窗口。",
        attack: "无普攻刀气。奔跑转向会积累最多 10 层健步，每层提高移动表现。",
        skills: [
          { key: "被动", name: "健步", description: "奔跑中持续转向积累健步标记，叠层后更适合在板窗区反复变向。" },
          { key: "Q", name: "突刺", description: "向前突刺约 480 距离，持续约 0.5 秒且可中途变向；触碰追捕者会短暂眩晕。冷却 20 秒。" }
        ]
      },
      fighter: {
        style: "短斗篷、护手与轻便格斗装，局内以铜棕配色区分。",
        overview: "近身气球救援位。靠赶援快速切入牵人追捕者身边，再用破缚拳打断牵人；四次成功眩晕后可展开一次擂台单挑。",
        attack: "无普攻刀气。队友被牵起且处于范围内时，朝其方向移动可获得 8% 移速。",
        skills: [
          { key: "被动", name: "赶援", description: "队友正在被牵且位于 760 范围内时，朝该队友移动获得 8% 移速；离开范围或队友被放下后失效。" },
          { key: "J", name: "破缚拳", description: "按当前追捕者普攻的同等前摇后，覆盖其普攻刀气距离的前方半圆；命中造成 1.5 秒眩晕。追捕者牵人时命中会救下气球上的队友。每次实际眩晕会积累 1 层；命中冷却 20 秒，未命中冷却 12 秒。" },
          { key: "Q · 每局一次", name: "擂台", description: "成功眩晕追捕者 4 次后可用。双方被拉入覆盖原地图障碍的独立临时空地，先准备 2 秒，最多维持 20 秒；场外队友照常行动与修机。双方各有 2 点擂台生命，并在擂台内将 Q 改为向前跳 2 米的跳步；追捕者只能普攻，格斗家的 J 无冷却、每拳扣 1 点追捕者生命并有短暂后摇。追捕者倒下则立即离场眩晕 2 秒；格斗家倒下或倒计时结束时离场并扣除 1 点生命。" }
        ]
      },
      antiqueDealer: {
        style: "白金与青玉古装、华丽发簪与机关箫；当前局内使用专属 Q 版立绘。",
        overview: "高操作隐藏辅助位。展开机关箫后，以不同招式击退追捕者，撞墙可打出连棍止戈。",
        attack: "无普攻刀气。旧伤使开门速度降低 50%。心跳范围内有队友时，藏拙会令止戈时长减半。",
        skills: [
          { key: "Q", name: "机关箫", description: "展开或收起机关箫；展开后可持续使用 1 至 5 的五种招式，不会因单次招式自动收起。" },
          { key: "1 / 2 / 3", name: "扫式、点刺与抡式", description: "扫式从右向左横挥并向左击退，点刺向正前方突进并向前击退，抡式从左向右横挥并向右击退；若击退撞墙，追捕者眩晕 1 秒并进入止戈，不能普攻但仍可使用专属技能。1 秒内连续撞墙可依次追加 6 / 13 / 20 秒止戈；心跳范围内有队友时减半。每招独立冷却 25 秒。" },
          { key: "4", name: "云门跳跃", description: "向前跳跃，可越过板窗与单层薄墙；厚墙无法越过。冷却 25 秒。" },
          { key: "5", name: "转式加速", description: "自身移速提高 20%，持续 5 秒。冷却 25 秒。" }
        ]
      },
      general: {
        style: "金甲将军与战马，步行和骑马使用两套局内造型。",
        overview: "救援与强行开路型角色。骑马能快速到达战场，满怒冲撞可把追捕者撞开并制造眩晕。",
        attack: "无普攻刀气。受追击时骑马能持续积攒怒气。",
        skills: [
          { key: "Q", name: "骑马", description: "进入最长 20 秒的骑马状态，移速提高 40%；可用鞭策进一步提速。骑马期间无法修机，按 E 可主动下马。冷却 40 秒。" },
          { key: "满怒 Q", name: "蛮力冲撞", description: "被追击时每秒获得 2 点怒气，10 点满怒后再次按 Q 后撤助跑并冲刺；命中追捕者会击退，撞墙时眩晕。" }
        ]
      },
      shieldBearer: {
        style: "沉稳厚甲与宽面大盾；举盾时盾面会朝向角色当前面对方向。",
        overview: "容易上手的牵制位。用举盾削减正面伤害并借受击后退拉开距离，但板窗交互偏慢。",
        attack: "无普攻刀气。板窗交互速度降低 15%；坚强每 60 秒抵消一次追捕者施加的负面状态。",
        skills: [
          { key: "被动", name: "坚强", description: "每 60 秒抵消一次追捕者施加的负面状态；不会抵消伤害、位移或举盾自身的后退。" },
          { key: "Q", name: "举盾", description: "举盾 5 秒，期间移速降低 15% 且无法修机、治疗或主动下板；仍可救援队友、翻窗和翻越倒板。正面盾区被攻击覆盖时，伤害减少 50 点裂伤；举盾期间每次受击都会向角色身后弹射约 2 米。冷却 28 秒。" }
        ]
      },
      tuner: {
        style: "羽笔、卷轴与深棕红披风；当前局内使用下载的新立绘。",
        overview: "靠高频修机积累共振，再将共振转化为减速线和密码机爆发进度。",
        attack: "无普攻刀气。修机每秒积累共振；被监管持续牵制时也会缓慢积累。",
        skills: [
          { key: "被动", name: "共振与悲痛校准", description: "修机、成功校准和完美校准都会获得共振；任一队友新受伤时，正在修机的调律师会连续触发 3 次真实校准，冷却 30 秒。" },
          { key: "Q", name: "回声带", description: "消耗 60 共振放出持续 5 秒的回声带；追捕者触线后减速 50% 持续 1 秒。冷却 10 秒。" },
          { key: "修机 Q", name: "校正", description: "修机时消耗 20 共振，使当前密码机立即增加 10% 进度。每台机可多次使用，冷却 15 秒。" }
        ]
      }
    },
    [PLAYER_ROLE.hunter]: {
      standard: {
        style: "墨绿猎装、铜色犬哨与自动追猎的黑犬。",
        overview: "操作简单的追击型追捕者。放出无法手动控制的猎犬，自动追踪并咬停逃生者。",
        skills: [
          { key: "Q", name: "放犬", description: "自动追踪 600 范围内最近的可行动逃生者，持续 4 秒。咬中使目标眩晕 1 秒；玩家不能切换或手动控制猎犬。冷却 22 秒。" },
          { key: "一阶", name: "撕咬", description: "猎犬撕咬不再额外造成伤害，仍会打断交互并眩晕目标。" },
          { key: "二阶", name: "越障围猎", description: "猎犬每次出动可瞬间越过一次倒板或窗户；成功咬中返还 6 秒放犬冷却。" }
        ]
      },
      brute: {
        style: "暗红重甲与双手震锤，蓄力后向前跃击。",
        overview: "以慢前摇换取板区压制。按住蓄力决定跃击距离，落地震荡造成半格伤害并破坏倒板。",
        skills: [
          { key: "Q", name: "震荡锤", description: "按住蓄力、松开向面朝方向跃击；蓄力越久跃得越远，遇实体墙提前落地。落地扇形震荡造成 50 点裂伤、击退约 1.5 米并直接破坏命中的倒板；直接命中后 1.2 秒不能翻板翻窗。冷却 16 秒。" },
          { key: "一阶", name: "震颤", description: "震荡命中后使目标板窗交互减慢 20%，持续 3 秒。" },
          { key: "二阶", name: "满势", description: "提高满蓄跃击距离与震荡范围；若本次只破坏板子、没有命中逃生者，返还 6 秒冷却。" }
        ]
      },
      lanternKeeper: {
        style: "红黑提灯装束与寄魂灯，局内使用提灯人 Q 版造型。",
        overview: "通过多盏寄魂灯控制区域，既能限制修机，又能用鬼火远程补伤害。",
        skills: [
          { key: "被动", name: "灯域压制", description: "求生者处于寄魂灯范围内时修机和翻越受限；追捕者在灯域中获得移速收益。" },
          { key: "Q", name: "寄魂灯", description: "放置寄魂灯建立灯域，最多维持多盏。放置冷却 8 秒。" },
          { key: "E", name: "鬼火吞噬", description: "每盏已放置寄魂灯向上下左右喷出可穿墙鬼火，约 6 米；每道命中造成半格伤害，同次命中可叠加。冷却 16 秒。" },
          { key: "一阶", name: "灯影穿行", description: "可借助寄魂灯进行快速位移，强化区域追击与守椅。" }
        ]
      },
      sawbone: {
        style: "骨白皮革与锯刃，局内使用锯骨 Q 版造型。",
        overview: "持续压制型追捕者。普攻流血逼迫治疗，拉锯则换取强突进和高风险命中。",
        skills: [
          { key: "被动", name: "流血", description: "普攻会叠加流血压力，迫使求生者寻找治疗窗口。" },
          { key: "Q", name: "拉锯", description: "启动电锯高速冲刺。拉锯期间命中、撞墙、被眩晕或击退都会直接断锯。" },
          { key: "二阶", name: "无限锯", description: "二阶后拉锯不再受耐久限制，仍保留命中、撞墙和受控断锯规则。" }
        ]
      },
      soulBinder: {
        style: "幽紫引魂长袍与魂印，局内使用引魂师 Q 版造型。",
        overview: "以魂印密码机为核心，零阶魂巡快速转点压机；拿刀后再用摄魂和借魂扩大战果。",
        skills: [
          { key: "被动", name: "魂印", description: "普攻叠加魂印；魂印会持续拖慢求生者的修机和交互效率。" },
          { key: "F", name: "魂巡", description: "零阶首次按 F 对密码机施加魂印，第二次按 F 才进入半漂浮加速；撞到倒板或窗户会瞬时跨到另一侧，不耗翻越时间、不破板且不触发禁闭空间。魂印机持续修理每 10 秒叠 1 层魂印；每次击倒会强化下一次远程魂巡并持续退机。" },
          { key: "Q", name: "摄魂", description: "一阶后对带魂印目标施加摄魂压制，创造更强的追击窗口。" },
          { key: "E", name: "借魂", description: "二阶后消耗或利用魂印获得借魂状态，强化移动与追击路线。" }
        ]
      },
      mirrorGhost: {
        style: "蓝白镜面幽灵，局内使用镜鬼 Q 版造型。",
        overview: "空间控制型追捕者。裂缝负责转点，镜幕封路，镜光把附近求生者强行拉回身边。",
        skills: [
          { key: "被动", name: "破碎空间", description: "对求生者造成伤害时在其脚下生成空间裂缝；45 秒无心跳的求生者附近也会生成。裂缝最多 6 条，倒地者不触发传送。" },
          { key: "Q", name: "镜幕", description: "拖拽放置持续 12 秒的镜幕，求生者无法穿过；镜鬼穿裂缝时优先可转到镜幕。冷却 20 秒。" },
          { key: "一阶 E", name: "镜光", description: "所有裂缝 140 范围内爆发强光，致盲 1.8 秒并把求生者吸入裂缝，随后强行拉到镜鬼身边。冷却 45 秒。" },
          { key: "二阶", name: "华镜", description: "求生者触碰镜幕时会被传送到镜鬼身边。" }
        ]
      },
      dancer: {
        style: "紫金皇冠、权杖与层叠紫黑礼服，局内使用舞者 Q 版造型与粉色舞线特效。",
        overview: "高上限的路线封锁追捕者。通过两枚舞点延迟连线，逼迫求生者离开安全交互区。",
        skills: [
          { key: "被动", name: "灵魂侵蚀", description: "每层侵蚀使交互、修机和开门效率降低 10%，默认最多 3 层。" },
          { key: "Q", name: "舞步", description: "拖拽选择落点后向该方向位移并放下舞点。第二枚舞点落下约 0.4 秒后连成舞线；舞线初成命中造成一格伤害，之后触线只叠侵蚀。舞点持续 12 秒，舞线持续 5 秒，冷却 7 秒。" },
          { key: "一阶 E", name: "旋步", description: "沿现有舞线短距离位移，冷却 7 秒。" },
          { key: "二阶 F", name: "无穷舞", description: "持续 15 秒；期间舞步冷却 3 秒、旋步冷却 2 秒。冷却 50 秒，侵蚀上限提高至 5 层。" }
        ]
      },
      edictor: {
        style: "黑金紫执法长衣、禁令封条、单片眼镜与裁定杖；局内使用禁令官 Q 版立绘。",
        overview: "低数值控场追捕者。封界压板窗，裁定钩子把违令转化为有限的追击收益。",
        skills: [
          { key: "Q", name: "封界", description: "在脚下布置封界陷阱，全场最多 2 枚。求生者踩中会获得 1 层违令并眩晕 1 秒；单枚冷却 12 秒。" },
          { key: "E", name: "裁定", description: "按住瞄准、松开钩出，冷却 20 秒。命中目标眩晕 1 秒；零层违令目标在 2 秒内翻板翻窗慢 20%，已有一层违令则被拉至面前。" },
          { key: "一阶", name: "裂伤裁定", description: "钩子命中求生者额外造成 50 点裂伤。" },
          { key: "二阶", name: "越界执行", description: "钩子命中墙体时，禁令官会被拉至撞墙位置；该位移不穿墙，并返还 8 秒裁定冷却。" }
        ]
      },
      abyss: {
        style: "深海考察服、旧式潜水面罩与被触须侵蚀的身体；当前使用通用追捕者外观。",
        overview: "人类学者在深海遗迹遭受侵蚀后形成的双形态追捕者。人相注视积累深渊值，诡异形态以投影扰乱交互与走位。",
        skills: [
          { key: "外在特质", name: "深渊之息", description: "持续注视一名处于面朝前方且无遮挡的求生者时，每 2 秒获得 1 点深渊值，最多 20 点。失去视野时，未结算的注视进度每秒衰减 5%。" },
          { key: "外在特质", name: "触须感知", description: "12 米内的求生者受伤或交互时，获得其方向箭头提示 3 秒。" },
          { key: "Q", name: "深海触须", description: "按住瞄准显示地面扇形，松开后触须先飞向落点；抵达后预警 0.5 秒，再在落点前方横扫 3 格。命中的目标受到 50 裂伤；交互中的目标会被打断并僵直 1 秒。冷却 8 秒。" },
          { key: "E", name: "沉没", description: "消耗 10 点深渊值进入诡异形态 25 秒，形态期间不能主动结束；自然结束后进入 20 秒冷却。" },
          { key: "一阶 F", name: "深渊低语", description: "人相下释放 15 米音波，使范围内求生者移速降低 50%、交互速度降低 25%，持续 3 秒。冷却 40 秒。" },
          { key: "诡异 E", name: "深渊投影", description: "投射一个自动追逐最近目标的人机追捕者，持续 5 秒。投影普攻固定造成 50 裂伤；消散时 5 米内求生者方向反转 1.5 秒；AI 同样受影响。冷却 20 秒。" },
          { key: "二阶", name: "沉没强化", description: "诡异形态刀气增加 20%；投影冷却降至 12 秒，消散混乱范围提高至 7 米、持续 2.5 秒；击倒求生者会将诡异形态重置至 25 秒。" }
        ]
      },
      twinSword: {
        style: "赵青天与池音双形态剑仙；局内会随形态切换对应 Q 版造型。",
        overview: "隐藏高机动追捕者，靠形态切换、区域压迫和远程飞剑形成连续追击。",
        skills: [
          { key: "Q", name: "双生切换", description: "在赵青天与池音形态间切换，根据当前战局选择近身压迫或空间控制。" },
          { key: "E / R", name: "形态技能", description: "两种形态分别拥有时之力、空之力、影锁与影袭等技能，用于减速、封锁与快速接近。" },
          { key: "一阶 G", name: "双生之力", description: "开启后进入 8 秒待发状态，下一次形态技能会同时释放另一形态的对应技能；触发后结束待发。冷却 60 秒。" },
          { key: "F", name: "飞剑", description: "发射远程飞剑补刀或打断路线；飞剑也能抵消部分控制。" }
        ]
      }
    }
  };
  let characterCodexRole = PLAYER_ROLE.survivor;
  let characterCodexCharacterId = "clockmaker";
  let fighterArena = null;

  const AI_SURVIVOR_CHARACTER_ORDER = ["clockmaker", "actor", "messenger", "apprentice", "navigator", "medic", "perfumer", "fencer", "fighter", "general", "shieldBearer", "tuner"];
  const AI_SURVIVOR_CHARACTER_WEIGHTS = {
    clockmaker: 1,
    actor: 1,
    messenger: 1,
    apprentice: 1,
    navigator: 0.9,
    medic: 1,
    perfumer: 1,
    fencer: 0.2,
    fighter: 0.65,
    general: 1,
    shieldBearer: 0.9,
    tuner: 0.8
  };
  const AI_HUNTER_CHARACTER_ORDER = ["standard", "brute", "lanternKeeper", "sawbone", "soulBinder", "mirrorGhost", "dancer", "edictor", "abyss"];
  const AI_HUNTER_CHARACTER_WEIGHTS = {
    standard: 0.55,
    brute: 0.55,
    lanternKeeper: 1.65,
    sawbone: 1,
    soulBinder: 1.65,
    mirrorGhost: 0.45,
    dancer: 0.85,
    edictor: 0.8,
    abyss: 0.65
  };
  const AI_HUNTER_ASSIST_ORDER = ["listen", "peeper", "abnormal", "patroller", "blink", "excitement"];
  const AI_HUNTER_ASSIST_WEIGHTS = {
    listen: 0.7,
    peeper: 1,
    abnormal: 0.9,
    patroller: 0.8,
    blink: 1.15,
    excitement: 0.7
  };

  const ATTACK_KEY = "j";
  const SKILL_KEY = "q";
  const SHADOW_KEY = "f";
  const CLOCKMAKER_ID = "clockmaker";
  const ACTOR_ID = "actor";
  const MEDIC_ID = "medic";
  const FENCER_ID = "fencer";
  const FIGHTER_ID = "fighter";
  const ANTIQUE_DEALER_ID = "antiqueDealer";
  const GENERAL_ID = "general";
  const SHIELD_BEARER_ID = "shieldBearer";
  const TUNER_ID = "tuner";
  const TWIN_SWORD_ID = "twinSword";
  const MIRROR_GHOST_ID = "mirrorGhost";
  const DANCER_ID = "dancer";
  const EDICTOR_ID = "edictor";
  const ABYSS_ID = "abyss";
  const HOUND_MASTER_ID = "standard";
  const HAMMERER_ID = "brute";
  const PROFILE_UNLOCK_STORAGE_KEY = "asymmetric-chase-unlocks-v1";
  const PROFILE_TASK_STORAGE_KEY = "asymmetric-chase-unlock-tasks-v1";
  let developerUnlockAllCharacters = readDeveloperUnlockMode();
  const HUNTER_HIT_RECOVERY = 3000;
  const HUNTER_MISS_RECOVERY = 760;
  const HEAL_INJURED_DURATION = 9000;
  const HEAL_DOWNED_DURATION = 11000;
  const SELF_HEAL_DOWNED_DURATION = 14000;
  const SELF_HEAL_CAP = 0.95;
  const SURVIVOR_PALLET_PROMPT_RANGE = 112;
  const SURVIVOR_WINDOW_PROMPT_RANGE = 108;
  const HUNTER_PALLET_PROMPT_RANGE = 126;
  const HUNTER_WINDOW_PROMPT_RANGE = 142;
  const HUNTER_WINDOW_VAULT_DURATION = 640;
  const REPAIR_REQUIRED = 5;
  const HATCH_REPAIR_REQUIRED = 2;
  const PLAYER_REPAIR_DURATION = 60000;
  const AI_REPAIR_DURATION = 60000;
  const GATE_OPEN_DURATION = 25000;
  const GATE_ESCAPE_DURATION = 3000;
  const HATCH_ESCAPE_DURATION = 1500;
  const DOWNED_CRAWL_SPEED = 58;
  const CHAIR_ELIMINATION_DURATION = 60000;
  const BLEED_OUT_DURATION = 100000;
  const PICKUP_SURVIVOR_DURATION = 1400;
  const RESCUE_DURATION = 2000;
  const AI_RESCUE_FIRST_CHAIR_TARGET = 0.49;
  const AI_RESCUE_SECOND_CHAIR_TARGET = 0.99;
  const AI_RESCUE_FIRST_CHAIR_DANGER = 0.38;
  const AI_RESCUE_SECOND_CHAIR_DANGER = 0.82;
  const AI_RESCUE_HUNTER_NEAR_CHAIR = 300;
  const AI_RESCUE_EMERGENCY_WINDOW = 0.035;
  const AI_RESCUE_ATTACK_DODGE_DELAY = 220;
  const AI_RESCUE_ASSIGNMENT_MAX_DISTANCE = 1100;
  const AI_RESCUE_HIT_CLAIM_RANGE = 300;
  const AI_ACTOR_MAGIC_SHOW_RESCUE_DISTANCE = 620;
  const AI_ACTOR_RESCUE_PHANTOM_CHAIR_RANGE = 520;
  const AI_UPDATE_INTERVAL = 24;
  const AI_HUNTER_UPDATE_INTERVAL = 24;
  const HUD_UPDATE_INTERVAL = 100;
  const AI_TEAM_PLAN_INTERVAL = 800;
  const AI_PATH_STALL_CHECK_INTERVAL = 900;
  const AI_PATH_STALL_MIN_DISTANCE = 10;
  const AI_KITE_PATH_STALL_CHECK_INTERVAL = 360;
  const AI_KITE_PATH_STALL_MIN_DISTANCE = 6;
  const AI_KITE_ROUTE_LOCK_DURATION = 1200;
  const AI_KITE_UNSTUCK_DURATION = 650;
  const AI_CLOSE_KITE_RANGE = 260;
  const AI_PALLET_MINDGAME_DURATION = 420;
  const AI_HUNTER_ATTACK_INNER_RANGE_MULTIPLIER = 0.72;
  const CARRY_STRUGGLE_DURATION = 10500;
  const CARRY_ESCAPE_STUN = 1400;
  const RESCUE_SPEED_BOOST_DURATION = 1800;
  const MEDIC_RESCUE_SHIELD_DURATION = 15000;
  const MEDIC_SHIELD_KNOCKBACK = 86;
  const MEDIC_SHIELD_STUN = 3000;
  const MESSENGER_SHIELD_WIPE_DURATION = 2000;
  const MEDIC_ADRENALINE_DURATION = 6000;
  const MEDIC_ADRENALINE_COOLDOWN = 20000;
  const MEDIC_ADRENALINE_SPEED_BOOST = 1.4;
  const MEDIC_FIRST_CHASE_DURATION = 3000;
  const MEDIC_FIRST_CHASE_SPEED_BOOST = 1.15;
  const SHIELD_GUARD_DURATION = 5000;
  const SHIELD_GUARD_COOLDOWN = 28000;
  const SHIELD_GUARD_MOVE_MULTIPLIER = 0.85;
  const SHIELD_GUARD_DAMAGE_REDUCTION = 0.5;
  const SHIELD_GUARD_FRONT_ARC = Math.PI * 0.72;
  const SHIELD_GUARD_KNOCKBACK = 96;
  const SHIELD_BEARER_PALLET_DURATION_MULTIPLIER = 1.15;
  const SHIELD_BEARER_TOUGHNESS_COOLDOWN = 60000;
  const CHAIR_PRESSURE_RANGE = 420;
  const ACTION_STALE_GRACE = 1400;
  const STUCK_RECOVERY_RADIUS = 22;
  const MOVE_COLLISION_STEP = 8;
  const COLLISION_PUSH_EPSILON = 0.35;
  const AI_OBJECTIVE_ABORT_RANGE = 320;
  const AI_GATE_OPEN_ABORT_RANGE = 220;
  const AI_OPEN_GATE_PRIORITY_RANGE = 420;
  const AI_GATE_ACTION_RANGE = 150;
  const GATE_USE_RANGE = 176;
  const GATE_POINT_USE_RANGE = 76;
  const HUNTER_TARGET_LOCK_AFTER_HIT = 7600;
  const HUNTER_TARGET_LOCK_MAX_DISTANCE = 980;
  const HUNTER_TARGET_STICKY_BASE = 360;
  const HUNTER_TARGET_STICKY_HIT_BONUS = 360;
  const AI_HEAL_MIN_INJURED_AGE = 9000;
  const AI_HEAL_TARGET_MIN_HUNTER_DISTANCE = 520;
  const AI_HEALER_MIN_HUNTER_DISTANCE = 540;
  const AI_DOWNED_HEAL_TARGET_MIN_HUNTER_DISTANCE = 620;
  const AI_DOWNED_HEAL_MAX_DISTANCE = 900;
  const PRESENCE_TIER_ONE_HITS = 2;
  const PRESENCE_TIER_TWO_HITS = 5;
  const MESSENGER_ID = "messenger";
  const PACKAGE_COOLDOWN = 22000;
  const PACKAGE_STUN_DURATION = 1500;
  const PACKAGE_HIT_BOOST_DURATION = 2000;
  const MESSENGER_CARRY_RESCUE_SHIELD_DURATION = 15000;
  const PACKAGE_CHASE_HIT_COOLDOWN_REFUND = 8000;
  const PACKAGE_RECOIL_DURATION = 180;
  const PACKAGE_RECOIL_DISTANCE = 92;
  const PACKAGE_SPEED = 760;
  const PACKAGE_RANGE = 620;
  const PACKAGE_RADIUS = 13;
  const PACKAGE_HIT_RADIUS = 34;
  const ACTOR_RESCUE_PHANTOM_RANGE = 310;
  const ACTOR_RESCUE_PHANTOM_GUARD_DISTANCE = 92;
  const AI_MESSENGER_HIT_SUPPORT_WINDOW = 7000;
  const AI_MESSENGER_ESCORT_DURATION = 7500;
  const AI_MESSENGER_CARRY_RESCUE_DISTANCE = 500;
  const QUICK_CHAT_RESCUE_DURATION = 15000;
  const QUICK_CHAT_RESCUE_CLAIM_DURATION = 10000;
  const QUICK_CHAT_WAIT_DURATION = 5000;
  const QUICK_CHAT_HEAL_DURATION = 10000;
  const QUICK_CHAT_HELP_DURATION = 8000;
  const QUICK_CHAT_REPAIR_DURATION = 12000;
  const EDICTOR_TRAP_COOLDOWN = 12000;
  const EDICTOR_TRAP_LIMIT = 2;
  const EDICTOR_TRAP_RADIUS = 34;
  const EDICTOR_TRAP_STUN_DURATION = 1000;
  const EDICTOR_HOOK_COOLDOWN = 20000;
  const EDICTOR_HOOK_SPEED = 880;
  const EDICTOR_HOOK_RANGE = 720;
  const EDICTOR_HOOK_RADIUS = 18;
  const EDICTOR_HOOK_STUN_DURATION = 1000;
  const EDICTOR_HOOK_SLOW_DURATION = 2000;
  const EDICTOR_HOOK_VAULT_SLOW = 1.2;
  const EDICTOR_HOOK_PULL_DISTANCE = 56;
  const EDICTOR_TIER_TWO_WALL_REFUND = 8000;
  const CRITICAL_POINT_COOLDOWN = 20000;
  const EMBER_DOWNED_BOOST_DURATION = 3000;
  const EMBER_DOWNED_CRAWL_MULTIPLIER = 1.35;
  const HOUND_COOLDOWN = 22000;
  const HOUND_DURATION = 4000;
  const HOUND_TARGET_RANGE = 600;
  const HOUND_SPEED = 390;
  const HOUND_RADIUS = 16;
  const HOUND_BITE_RANGE = 22;
  const HOUND_BITE_STUN_DURATION = 1000;
  const HOUND_TIER_TWO_REFUND = 6000;
  const HAMMER_COOLDOWN = 16000;
  const HAMMER_MIN_CHARGE = 250;
  const HAMMER_MAX_CHARGE = 1200;
  const HAMMER_MIN_LEAP_DISTANCE = 100;
  const HAMMER_MAX_LEAP_DISTANCE = 288;
  const HAMMER_TIER_TWO_MAX_LEAP_DISTANCE = 360;
  const HAMMER_LEAP_DURATION = 280;
  const HAMMER_MIN_IMPACT_RANGE = 140;
  const HAMMER_MAX_IMPACT_RANGE = 228;
  const HAMMER_TIER_TWO_MAX_IMPACT_RANGE = 276;
  const HAMMER_IMPACT_ARC = Math.PI * 0.75;
  const HAMMER_DAMAGE = 0.5;
  const HAMMER_KNOCKBACK = 72;
  const HAMMER_RECOVERY = 550;
  const HAMMER_VAULT_LOCK_DURATION = 1200;
  const HAMMER_VAULT_SLOW_DURATION = 3000;
  const HAMMER_VAULT_SLOW = 1.2;
  const HAMMER_TIER_TWO_PALLET_REFUND = 6000;
  const ABYSS_VALUE_MAX = 20;
  const ABYSS_GAZE_INTERVAL = 2000;
  const ABYSS_GAZE_PROGRESS_DECAY_PER_SECOND = 0.05;
  const ABYSS_GAZE_RANGE = 720;
  const ABYSS_GAZE_ARC = Math.PI * 0.72;
  const ABYSS_SENSE_RANGE = 576;
  const ABYSS_SENSE_DURATION = 3000;
  const ABYSS_TENTACLE_COOLDOWN = 8000;
  const ABYSS_TENTACLE_SPEED = 860;
  const ABYSS_TENTACLE_RANGE = 620;
  const ABYSS_TENTACLE_DELAY = 500;
  const ABYSS_TENTACLE_STRIKE_RANGE = 240;
  const ABYSS_TENTACLE_STRIKE_ARC = Math.PI * 0.92;
  const ABYSS_TENTACLE_SWEEP_DURATION = 220;
  const ABYSS_TENTACLE_DAMAGE = 0.5;
  const ABYSS_TENTACLE_STAGGER = 1000;
  const ABYSS_FORM_COST = 10;
  const ABYSS_FORM_DURATION = 25000;
  const ABYSS_FORM_COOLDOWN = 20000;
  const ABYSS_FORM_SPEED_MULTIPLIER = 1.08;
  const ABYSS_WHISPER_COOLDOWN = 40000;
  const ABYSS_WHISPER_RANGE = 720;
  const ABYSS_WHISPER_DURATION = 3000;
  const ABYSS_WHISPER_MOVE_MULTIPLIER = 0.5;
  const ABYSS_WHISPER_INTERACTION_MULTIPLIER = 0.75;
  const ABYSS_PROJECTION_COOLDOWN = 20000;
  const ABYSS_PROJECTION_TIER_TWO_COOLDOWN = 12000;
  const ABYSS_PROJECTION_DURATION = 5000;
  const ABYSS_PROJECTION_SPEED = 302;
  const ABYSS_PROJECTION_ATTACK_COOLDOWN = 1000;
  const ABYSS_PROJECTION_ATTACK_DAMAGE = 0.5;
  const ABYSS_PROJECTION_ATTACK_WINDUP = 180;
  const ABYSS_PROJECTION_CONFUSION_RANGE = 240;
  const ABYSS_PROJECTION_TIER_TWO_CONFUSION_RANGE = 336;
  const ABYSS_PROJECTION_CONFUSION_DURATION = 1500;
  const ABYSS_PROJECTION_TIER_TWO_CONFUSION_DURATION = 2500;
  const CONFINED_SPACE_WINDOW_BLOCK_DURATION = 10000;
  const APPRENTICE_ID = "apprentice";
  const NAVIGATOR_ID = "navigator";
  const NAVIGATION_CHANNEL_COOLDOWN = 16000;
  const NAVIGATION_CHANNEL_RADIUS = 44;
  const NAVIGATION_CHANNEL_SLIDE_DISTANCE = 400;
  const NAVIGATION_CHANNEL_SLIDE_DURATION = 700;
  const NAVIGATION_CHANNEL_AIM_RANGE = 520;
  const NAVIGATION_CHANNEL_RIDE_COOLDOWN = 20000;
  const NAVIGATION_CHANNEL_DISMANTLE_RANGE = 96;
  const NAVIGATION_CHANNEL_DISMANTLE_DURATION = 1300;
  const PERFUMER_ID = "perfumer";
  const PERFUMER_SENSE_FAR_RANGE = 1200;
  const PERFUMER_SENSE_NEAR_RANGE = 600;
  const PERFUME_MIST_RADIUS = 400;
  const PERFUME_MIST_DURATION = 10000;
  const PERFUME_MIST_COOLDOWN = 20000;
  const PERFUME_ALLY_STEALTH_DURATION = 5000;
  const PERFUME_HUNTER_SPEED_MULTIPLIER = 0.9;
  const PERFUME_SELF_SPEED_BOOST = 1.15;
  const PERFUME_ULTIMATE_CHARGES = 4;
  const PERFUME_ULTIMATE_RADIUS = 600;
  const PERFUME_ULTIMATE_DURATION = 20000;
  const PERFUME_ULTIMATE_SURVIVOR_SPEED_BOOST = 1.2;
  const PERFUME_ULTIMATE_ILLUSIONS = 3;
  const FENCER_STRIDE_MARK_DURATION = 1000;
  const FENCER_STRIDE_MAX_MARKS = 10;
  const FENCER_STRIDE_SPEED_PER_MARK = 0.04;
  const FENCER_STRIDE_TURN_THRESHOLD = 0.46;
  const FENCER_STRIDE_TRIGGER_COOLDOWN = 160;
  const FENCER_LUNGE_DURATION = 500;
  const FENCER_LUNGE_DISTANCE = 480;
  const FENCER_LUNGE_COOLDOWN = 20000;
  const FENCER_LUNGE_TURN_ANGLE = Math.PI / 3;
  const FENCER_LUNGE_HUNTER_STUN = 500;
  const FIGHTER_PUNCH_DURATION = 520;
  const FIGHTER_PUNCH_ARC = Math.PI;
  const FIGHTER_PUNCH_STUN = 1500;
  const FIGHTER_PUNCH_HIT_COOLDOWN = 20000;
  const FIGHTER_PUNCH_MISS_COOLDOWN = 12000;
  const FIGHTER_RESCUE_RUSH_RANGE = 760;
  const FIGHTER_RESCUE_RUSH_MULTIPLIER = 1.08;
  const FIGHTER_PUNCH_STUNS_FOR_ARENA = 4;
  const FIGHTER_ARENA_RADIUS = 240;
  const FIGHTER_ARENA_HUNTER_HEALTH = 2;
  const FIGHTER_ARENA_PUNCH_WIPE = 850;
  const FIGHTER_ARENA_STEP_DISTANCE = 96;
  const FIGHTER_ARENA_STEP_RECOVERY = 350;
  const FIGHTER_ARENA_HUNTER_STUN = 2000;
  const FIGHTER_ARENA_MAX_DURATION = 20000;
  const ANTIQUE_SKILL_COOLDOWN = 25000;
  const ANTIQUE_STRIKE_WINDUP = 180;
  const ANTIQUE_STRIKE_DURATION = 320;
  const ANTIQUE_SWEEP_RANGE = 180;
  const ANTIQUE_SWEEP_ARC = Math.PI * 0.72;
  const ANTIQUE_THRUST_RANGE = 280;
  const ANTIQUE_THRUST_ARC = Math.PI * 0.24;
  const ANTIQUE_KNOCKBACK = 138;
  const ANTIQUE_WALL_STUN = 1000;
  const ANTIQUE_COMBO_WINDOW = 1000;
  const ANTIQUE_LEAP_DISTANCE = 280;
  const ANTIQUE_LEAP_DURATION = 420;
  const ANTIQUE_LEAP_MAX_OBSTACLE_THICKNESS = 60;
  const ANTIQUE_SPRINT_DURATION = 5000;
  const ANTIQUE_SPRINT_SPEED_BOOST = 1.2;
  const ANTIQUE_FLUTE_DURABILITY_MAX = 100;
  const ANTIQUE_FLUTE_RECOVERY_LOCK = 25000;
  const ANTIQUE_FLUTE_STRIKE_DURABILITY_COST = 15;
  const ANTIQUE_FLUTE_LEAP_DURABILITY_COST = 20;
  const ANTIQUE_FLUTE_SPRINT_DURABILITY_COST = 10;
  const ANTIQUE_STOP_ATTACK_MAX_DURATION = 20000;
  const ANTIQUE_STOP_ATTACK_DURATIONS = [6000, 12000, 20000];
  const ANTIQUE_STOP_ATTACK_COMBO_BONUS = [0, 1000, 0];
  const GENERAL_RIDE_DURATION = 20000;
  const GENERAL_RIDE_COOLDOWN = 40000;
  const GENERAL_RIDE_SPEED_BOOST = 1.4;
  const GENERAL_WHIP_COOLDOWN = 5000;
  const GENERAL_WHIP_SPEED_BOOST = 0.05;
  const GENERAL_RAGE_MAX = 10;
  const GENERAL_RAGE_GAIN_PER_SECOND = 2;
  const GENERAL_RAGE_CHASE_RANGE = 760;
  const GENERAL_RAM_WINDUP = 360;
  const GENERAL_RAM_DURATION = 520;
  const GENERAL_RAM_BACKSTEP_DISTANCE = 110;
  const GENERAL_RAM_DISTANCE = 360;
  const GENERAL_RAM_HIT_RANGE = 82;
  const GENERAL_RAM_KNOCKBACK = 190;
  const GENERAL_RAM_WALL_STUN = 1700;
  const TUNER_RESONANCE_MAX = 100;
  const TUNER_RESONANCE_PER_SECOND = 4.5;
  const TUNER_CHASE_RESONANCE_PER_SECOND = 1.2;
  const TUNER_CALIBRATION_SUCCESS_RESONANCE = 12;
  const TUNER_CALIBRATION_PERFECT_RESONANCE = 20;
  const TUNER_ECHO_COST = 60;
  const TUNER_ECHO_COOLDOWN = 10000;
  const TUNER_CIPHER_TUNE_COOLDOWN = 15000;
  const TUNER_ECHO_LENGTH = 260;
  const TUNER_ECHO_DURATION = 5000;
  const TUNER_ECHO_THICKNESS = 18;
  const TUNER_ECHO_SLOW_DURATION = 1000;
  const TUNER_ECHO_SLOW_MULTIPLIER = 0.5;
  const TUNER_SORROW_CALIBRATION_COOLDOWN = 30000;
  const TUNER_SORROW_CALIBRATION_COUNT = 3;
  const MIRROR_RIFT_RADIUS = 52;
  const MIRROR_RIFT_TRIGGER_RADIUS = 44;
  const MIRROR_RIFT_MAX = 6;
  const MIRROR_RIFT_TELEPORT_COOLDOWN = 1000;
  const MIRROR_RIFT_SURVIVOR_TELEPORT_COOLDOWN = 5000;
  const MIRROR_RIFT_NO_HEARTBEAT_DELAY = 45000;
  const MIRROR_RIFT_NO_HEARTBEAT_SPAWN_RADIUS = 96;
  const MIRROR_CURTAIN_COOLDOWN = 20000;
  const MIRROR_CURTAIN_DURATION = 12000;
  const MIRROR_CURTAIN_MIN_LENGTH = 80;
  const MIRROR_CURTAIN_MAX_LENGTH = 360;
  const MIRROR_CURTAIN_THICKNESS = 18;
  const MIRROR_LIGHT_COOLDOWN = 45000;
  const MIRROR_LIGHT_RADIUS = 140;
  const MIRROR_LIGHT_BLIND_DURATION = 1800;
  const AI_MIRROR_CURTAIN_PLACE_MIN_RANGE = 150;
  const AI_MIRROR_CURTAIN_PLACE_MAX_RANGE = 560;
  const AI_MIRROR_CURTAIN_LENGTH = 240;
  const DANCE_EROSION_MAX = 3;
  const DANCE_EROSION_INTERACTION_MULTIPLIER = 0.9;
  const DANCE_STEP_WINDUP = 600;
  const DANCE_STEP_DISTANCE = 188;
  const DANCE_POINT_DURATION = 12000;
  const DANCE_LINE_CONNECT_DELAY = 400;
  const DANCE_POINT_CAST_RANGE = 520;
  const DANCE_LINE_DURATION = 5000;
  const DANCE_LINE_THICKNESS = 18;
  const DANCE_SPIN_DISTANCE = 132;
  const DANCE_SPIN_COOLDOWN = 7000;
  const INFINITE_DANCE_DURATION = 15000;
  const INFINITE_DANCE_COOLDOWN = 50000;
  const INFINITE_DANCE_STEP_COOLDOWN = 3000;
  const INFINITE_DANCE_SPIN_COOLDOWN = 2000;
  const AI_DANCE_STEP_MIN_RANGE = 120;
  const AI_DANCE_STEP_MAX_RANGE = 330;
  const AI_DANCE_POINT_AVOID_RANGE = 360;
  const FLYWHEEL_DURATION = 400;
  const FLYWHEEL_SPEED_MULTIPLIER = 2;
  const FLYWHEEL_COOLDOWN = 50000;
  const KNEE_JERK_DURATION = 2000;
  const KNEE_JERK_COOLDOWN = 50000;
  const KNEE_JERK_SPEED_BOOST = 1.5;
  const WANTED_REVEAL_DURATION = 8000;
  const EXCITEMENT_GUARD_DURATION = 8000;
  const PERFUME_AI_CLOSE_VISION_RANGE = 96;
  const PERFUME_AI_WANDER_TURN_INTERVAL = 850;
  const PERFUME_AI_BLIND_ATTACK_CHANCE = 0.42;
  const STITCH_PACK_PICKUP_RADIUS = 34;
  const STITCH_HEAL_DELAY = 15000;
  const STITCH_PACK_COOLDOWN = 20000;
  const LANTERN_KEEPER_ID = "lanternKeeper";
  const LANTERN_AURA_RANGE = 300;
  const LANTERN_REPAIR_SLOWDOWN = 0.92;
  const SOUL_LAMP_RANGE = 300;
  const SOUL_LAMP_HUNTER_SPEED_BOOST = 1.2;
  const SOUL_LAMP_SURVIVOR_VAULT_SLOWDOWN = 1.1;
  const SOUL_LAMP_LIMIT = 2;
  const SOUL_LAMP_COOLDOWN = 8000;
  const SOUL_LAMP_SHADOW_TELEPORT_COOLDOWN = 30000;
  const SOUL_LAMP_ALERT_COOLDOWN = 4000;
  const SOUL_LAMP_ALERT_DURATION = 2400;
  const SOUL_LAMP_DETECT_FLASH = 1300;
  const SOUL_LAMP_RECALL_RANGE = 112;
  const SOUL_LAMP_DISMANTLE_RANGE = 90;
  const SOUL_LAMP_AI_DISMANTLE_RANGE = 230;
  const SOUL_LAMP_DISMANTLE_DURATION = 4000;
  const ASSIST_PEEPER_DISMANTLE_RANGE = 90;
  const ASSIST_PEEPER_AI_DISMANTLE_RANGE = 260;
  const ASSIST_PEEPER_DISMANTLE_DURATION = 2500;
  const GHOSTFIRE_COOLDOWN = 16000;
  const GHOSTFIRE_RANGE = 480;
  const GHOSTFIRE_SPEED = 820;
  const GHOSTFIRE_RADIUS = 12;
  const GHOSTFIRE_DAMAGE = 0.5;
  const REPAIR_CALIBRATION_FIRST_MIN = 7000;
  const REPAIR_CALIBRATION_FIRST_MAX = 10000;
  const REPAIR_CALIBRATION_INTERVAL_MIN = 14000;
  const REPAIR_CALIBRATION_INTERVAL_MAX = 20000;
  const REPAIR_CALIBRATION_DURATION = 2200;
  const REPAIR_CALIBRATION_SUCCESS_BONUS = 0.02;
  const REPAIR_CALIBRATION_PERFECT_BONUS = 0.05;
  const REPAIR_CALIBRATION_FAIL_PENALTY = 0.05;
  const REPAIR_CALIBRATION_FAIL_STUN_DURATION = 1200;
  const REPAIR_CALIBRATION_SUCCESS_SIZE = 0.24;
  const REPAIR_CALIBRATION_PERFECT_SIZE = 0.08;
  const AI_REPAIR_CALIBRATION_PERFECT_CHANCE = 0.2;
  const AI_REPAIR_CALIBRATION_FAIL_CHANCE = 0.1;
  const CLOCKMAKER_CALIBRATION_RANGE_MULTIPLIER = 0.85;
  const CLOCKMAKER_CALIBRATION_BONUS = 0.1;
  const TIME_REWIND_COOLDOWN = 30000;
  const TIME_REWIND_WINDOW = 10000;
  const TIME_REWIND_STEALTH_DURATION = 3000;
  const TIME_REWIND_BOOST_DURATION = 2000;
  const MAGIC_SHOW_COOLDOWN = 25000;
  const ACTOR_HIT_STEALTH_DURATION = 3000;
  const ACTOR_HIT_SPEED_BOOST = 1.15;
  const ACTOR_DECOY_DURATION = 7600;
  const ACTOR_DECOY_SPEED = 250;
  const ACTOR_RESCUE_PHANTOM_COOLDOWN = 50000;
  const ACTOR_RESCUE_PHANTOM_DURATION = 10000;
  const ACTOR_RESCUE_PHANTOM_SPEED = 440;
  const SAWBONE_ID = "sawbone";
  const SOUL_BINDER_ID = "soulBinder";
  const INITIAL_UNLOCKS = {
    survivor: [MESSENGER_ID, CLOCKMAKER_ID, NAVIGATOR_ID, SHIELD_BEARER_ID],
    hunter: [HOUND_MASTER_ID, HAMMERER_ID, LANTERN_KEEPER_ID, EDICTOR_ID]
  };
  const CHARACTER_UNLOCK_TASKS = {
    tuner: { role: PLAYER_ROLE.survivor, target: TUNER_ID, progressKey: "tunerFirstCipherBeforeInjury", goal: 5, label: "首个逃生受伤前修开一台机 5 局" },
    mirrorGhost: { role: PLAYER_ROLE.hunter, target: MIRROR_GHOST_ID, progressKey: "mirrorEndgameFourSafeWin", goal: 3, label: "开门战四人未飞并获胜 3 次" },
    dancer: { role: PLAYER_ROLE.hunter, target: DANCER_ID, progressKey: "dancerBlinkDown", goal: 7, label: "闪现后一刀击倒逃生者 7 次" },
    abyss: { role: PLAYER_ROLE.hunter, target: ABYSS_ID, progressKey: "hunterDown", goal: 6, label: "累计击倒逃生者 6 次" },
    apprentice: { role: PLAYER_ROLE.survivor, target: APPRENTICE_ID, progressKey: "healTeammate", goal: 2, label: "治疗队友 2 次" },
    actor: { role: PLAYER_ROLE.survivor, target: ACTOR_ID, progressKey: "rescue", goal: 3, label: "累计救人 3 次" },
    perfumer: { role: PLAYER_ROLE.survivor, target: PERFUMER_ID, progressKey: "escapeChase", goal: 2, label: "被追击后成功逃脱 2 次" },
    fencer: { role: PLAYER_ROLE.survivor, target: FENCER_ID, progressKey: "kiteSeconds", goal: 120, label: "牵制追捕 120 秒" },
    fighter: { role: PLAYER_ROLE.survivor, target: FIGHTER_ID, progressKey: "fighterPalletStun", goal: 3, label: "成功砸晕追捕者 3 次" },
    medic: { role: PLAYER_ROLE.survivor, target: MEDIC_ID, progressKey: "safeRescue", goal: 1, label: "救人后队友 30 秒内未倒地 1 次" },
    general: { role: PLAYER_ROLE.survivor, target: GENERAL_ID, progressKey: "injuredRescue", goal: 2, label: "受伤状态救人成功 2 次" },
    sawbone: { role: PLAYER_ROLE.hunter, target: SAWBONE_ID, progressKey: "hunterTierOne60", goal: 1, label: "60 秒内开启一阶" },
    soulBinder: { role: PLAYER_ROLE.hunter, target: SOUL_BINDER_ID, progressKey: "firstHitDown20", goal: 1, label: "首刀后 20 秒内击倒该求生者" },
    twinSwordFourKill: { role: PLAYER_ROLE.hunter, target: TWIN_SWORD_ID, progressKey: "fiveCipherFourKill", goal: 1, label: "5 台机尚未激活时拿下 4 抓" },
    twinSwordSkillBurst: { role: PLAYER_ROLE.hunter, target: TWIN_SWORD_ID, progressKey: "hunterSkillBurst5", goal: 1, label: "5 秒内释放 2 次追捕技能" },
    twinSwordRemoteDown: { role: PLAYER_ROLE.hunter, target: TWIN_SWORD_ID, progressKey: "remoteHunterDown", goal: 1, label: "远距离击倒逃生者" }
  };
  const SOUL_MARK_MAX = 3;
  const SOUL_BINDER_PRACTICE_SOUL_MARKS = 20;
  const SOUL_MARK_REPAIR_SLOWDOWN = 1.1;
  const SOUL_MARK_HEAL_POWER_MULTIPLIER = 0.8;
  const SOUL_MARK_VAULT_SLOWDOWN = 1.1;
  const SOUL_MARK_MOVE_SLOW = 0.85;
  const SOUL_SIPHON_DURATION = 7000;
  const SOUL_SIPHON_SPEED_BOOST = 1.2;
  const SOUL_SIPHON_FAIL_SLOW = 0.9;
  const SOUL_SIPHON_FAIL_DURATION = 3000;
  const SOUL_SIPHON_COOLDOWN = 25000;
  const AI_SOUL_SIPHON_MIN_RANGE = 170;
  const AI_SOUL_SIPHON_MAX_RANGE = 760;
  const BORROW_SOUL_DURATION = 15000;
  const BORROW_SOUL_COOLDOWN = 50000;
  const BORROW_SOUL_SPEED_PER_MARK = 0.03;
  const BORROW_SOUL_RECOVERY_PER_MARK = 0.05;
  const SOUL_PATROL_MAX_CIPHERS = 2;
  const SOUL_PATROL_COOLDOWN = 22000;
  const SOUL_PATROL_DURATION = 7000;
  const SOUL_PATROL_SPEED_BOOST = 1.4;
  const SOUL_PATROL_INSTANT_VAULTS_PER_CAST = 2;
  const SOUL_PATROL_EMPOWERED_DECAY_DURATION = 10000;
  const SOUL_PATROL_EMPOWERED_DECAY_INTERVAL = 1000;
  const SOUL_PATROL_EMPOWERED_DECAY_STEP = 0.02;
  const SOUL_PATROL_INSTANT_PALLET_APPROACH = 34;
  const SOUL_PATROL_INSTANT_WINDOW_APPROACH = 86;
  const SOUL_NOISE_MARK_INTERVAL = 10000;
  const SOUL_PATROL_DISMANTLE_RANGE = 96;
  const SOUL_PATROL_DISMANTLE_DURATION = 2000;
  const SOUL_PATROL_TARGET_RANGE = 168;
  const BONE_BLEED_DURATION = 10000;
  const BONE_BLEED_MAX_STACKS = 3;
  const BONE_BLEED_SLOW = 0.05;
  const BONE_BLEED_TIER_TWO_SLOW = 0.06;
  const PHYSICIAN_BENEVOLENCE_COOLDOWN = 60000;
  const PHYSICIAN_BENEVOLENCE_HEAL = 0.5;
  const DAMAGE_PROGRESS_EPSILON = 0.000001;
  const SAW_DASH_COOLDOWN = 20000;
  const SAW_DASH_DURATION = 680;
  const SAW_DASH_RANGE = 380;
  const SAW_DASH_TURN_SPEED = Math.PI * 2.15;
  const SAW_DASH_TIER_TWO_RANGE = 500;
  const SAW_DASH_TIER_TWO_TURN_SPEED = Math.PI * 2.45;
  const SAW_DASH_TIER_TWO_DURABILITY = 100;
  const SAW_DASH_DURABILITY_BASE_DRAIN = 3;
  const SAW_DASH_DURABILITY_TURN_DRAIN = 5;
  const SAW_DASH_DURABILITY_SLIDE_DRAIN = 0.16;
  const SAW_DASH_ATTACK_LOCKOUT = 3000;
  const TWIN_FORM_QINGTIAN = "qingtian";
  const TWIN_FORM_CHIYIN = "chiyin";
  const TWIN_INTENT_MAX = 500;
  const TWIN_INTENT_INITIAL = 300;
  const TWIN_INTENT_REGEN = 25;
  const TWIN_ENLIGHTENMENT_DURATION = 30000;
  const TWIN_ENLIGHTENMENT_TIER_ONE_DURATION = 45000;
  const TWIN_FORM_COOLDOWN = 8000;
  const TWIN_TIME_POWER_COST = 200;
  const TWIN_TIME_POWER_DURATION = 10000;
  const TWIN_SPACE_POWER_COST = 100;
  const TWIN_SPACE_POWER_RANGE = 520;
  const TWIN_SHADOW_LOCK_COOLDOWN = 30000;
  const TWIN_SHADOW_LOCK_DURATION = 45000;
  const TWIN_SHADOW_LOCK_RANGE = 150;
  const TWIN_SHADOW_LOCK_CAST_RANGE = 460;
  const TWIN_SHADOW_STRIKE_COOLDOWN = 30000;
  const TWIN_SHADOW_STRIKE_RANGE = 145;
  const TWIN_SHADOW_STRIKE_CAST_RANGE = 480;
  const TWIN_SHACKLE_MAX = 100;
  const TWIN_GAZE_RANGE = 480;
  const TWIN_GAZE_ARC = Math.PI * 0.52;
  const TWIN_GAZE_GAIN = 10;
  const TWIN_SHADOW_LOCK_GAIN = 20;
  const TWIN_SHACKLE_DECAY_DELAY = 10000;
  const TWIN_SHACKLE_DECAY = 5;
  const TWIN_SHACKLE_LOCK_DURATION = 5000;
  const TWIN_FLYING_SWORD_SPEED = 820;
  const TWIN_FLYING_SWORD_RANGE = 720;
  const TWIN_FLYING_SWORD_RADIUS = 15;
  const TWIN_DUAL_CAST_COOLDOWN = 60000;
  const SHORT_SAW_WINDOW = 1500;
  const SHORT_SAW_TIER_TWO_WINDOW = 2000;
  const SHORT_SAW_DURATION = 390;
  const SHORT_SAW_RANGE = 230;
  const SHORT_SAW_TURN_SPEED = Math.PI * 2.65;
  const ASSIST_LISTEN_DURATION = 8000;
  const ASSIST_LISTEN_MOVE_THRESHOLD = 22;
  const ASSIST_PEEPER_RANGE = 220;
  const ASSIST_PEEPER_DURATION = 45000;
  const ASSIST_PEEPER_INTERACTION_SPEED = 0.5;
  const ASSIST_ABNORMAL_RANGE = 128;
  const ASSIST_ABNORMAL_WINDUP = 1000;
  const ASSIST_ABNORMAL_FIRST_LOSS = 0.5;
  const ASSIST_ABNORMAL_MIN_LOSS = 0;
  const ASSIST_ABNORMAL_LOSS_STEP = 0.1;
  const ASSIST_ABNORMAL_DECAY_DURATION = 10000;
  const ASSIST_ABNORMAL_DECAY_INTERVAL = 1000;
  const ASSIST_ABNORMAL_DECAY_STEP = 0.01;
  const SURVIVOR_PALLET_DROP_DURATION = 320;
  const ASSIST_PATROLLER_DURATION = 12000;
  const ASSIST_PATROLLER_SPEED = 430;
  const ASSIST_PATROLLER_HIT_RANGE = 34;
  const ASSIST_PATROLLER_HOLD_DURATION = 1700;
  const ASSIST_PATROLLER_SLOW_DURATION = 6000;
  const ASSIST_PATROLLER_SLOW = 0.65;
  const ASSIST_BLINK_DISTANCE = 260;
  const ASSIST_BLINK_ATTACK_BUFFER = 520;
  const ASSIST_BLINK_DOWN_WINDOW = 1200;
  const ASSIST_BLINK_PHASE_WALL_THICKNESS = 56;
  const ASSIST_SHIFT_RANGE = 780;
  const ASSIST_SHIFT_DURATION = 20000;
  const ASSIST_SHIFT_RADIUS = 36;
  const ASSIST_SHIFT_TRIGGER_RANGE = 42;
  const ASSIST_SHIFT_USES = 2;
  const ASSIST_SHIFT_LOCKOUT = 620;
  const ADRENALINE_BOOST_DURATION = 5000;
  const BORROWED_TIME_DURATION = 20000;
  const FINAL_CIPHER_PRIME_PROGRESS = 0.99;
  const FINAL_CIPHER_GUARD_RANGE = 70;
  const CHARGED_ATTACK_HOLD_THRESHOLD = 180;
  const CHARGED_ATTACK_MAX_HOLD = 2000;
  const CHARGED_ATTACK_RANGE_MULTIPLIER = 1.18;
  const CHARGED_ATTACK_MOVE_MULTIPLIER = 1.1;
  const RAMPAGE_FIRST_PRESENCE_DELAY = 20000;
  const RAMPAGE_PRESENCE_INTERVAL = 30000;
  const RAMPAGE_PRESENCE_MAX_HITS = 2;
  const HEARTBEAT_RANGE = 520;
  const BASE_WORLD_WIDTH = 2400;
  const BASE_WORLD_HEIGHT = 1760;
  const MAP_SCALE = 1;
  const SCALE_EXISTING_MAP_LAYOUT = false;
  const CENTER_CLEARING_EXTRA_X = 0;
  const CENTER_CLEARING_EXTRA_Y = 0;

  const world = {
    width: BASE_WORLD_WIDTH + CENTER_CLEARING_EXTRA_X,
    height: BASE_WORLD_HEIGHT + CENTER_CLEARING_EXTRA_Y,
    tile: 80
  };

  const nav = {
    cell: 80,
    cols: Math.ceil(world.width / 80),
    rows: Math.ceil(world.height / 80)
  };

  const player = {
    name: "你",
    kind: "player",
    characterId: CLOCKMAKER_ID,
    initialX: 340,
    initialY: 330,
    x: 340,
    y: 330,
    radius: 22,
    speed: 250,
    sprintSpeed: 360,
    vx: 0,
    vy: 0,
    stamina: 100,
    angle: 0,
    state: "healthy",
    healProgress: 0,
    damageProgress: 0,
    selfHealUsed: false,
    bleedStacks: [],
    soulMarks: 0,
    chairProgress: 0,
    chairProgressPausedUntil: 0,
    injuredAt: null,
    downedAt: null,
    nextChairEliminates: false,
    carryProgress: 0,
    chair: null,
    boostUntil: 0,
    endgameBoostUntil: 0,
    adrenalineTriggered: false,
    borrowedTimeUntil: 0,
    borrowedTimePendingDamage: 0,
    borrowedTimeUsed: false,
    nextPhysicianBenevolenceAt: 0,
    medicShieldUntil: 0,
    medicShieldHits: 0,
    medicShieldSource: null,
    medicAdrenalineUntil: 0,
    medicAdrenalinePendingDamage: 0,
    medicRescueShockPendingDamage: 0,
    medicFirstChaseUsed: false,
    medicFirstChaseUntil: 0,
    stitchPack: null,
    timeDevice: null,
    invisibleUntil: 0,
    action: null,
    fill: "#e9efe6",
    core: "#d9b76a",
    nextInteractAt: 0,
    nextPackageAt: 0,
    nextNavigationChannelAt: 0,
    nextNavigationChannelRideAt: 0,
    nextTimeRewindAt: 0,
    nextMagicShowAt: 0,
    nextRescuePhantomAt: 0,
    nextStitchPackAt: 0,
    nextPerfumeMistAt: 0,
    nextTunerEchoAt: 0,
    nextTunerCipherTuneAt: 0,
    nextTunerSorrowCalibrationAt: 0,
    nextFencerLungeAt: 0,
    nextFighterPunchAt: 0,
    fighterPunchStunCount: 0,
    fighterArenaUsed: false,
    antiqueFluteOpen: false,
    antiqueDurability: ANTIQUE_FLUTE_DURABILITY_MAX,
    antiqueFluteLockedUntil: 0,
    nextAntiqueSweepLeftAt: 0,
    nextAntiqueThrustAt: 0,
    nextAntiqueSweepRightAt: 0,
    nextAntiqueLeapAt: 0,
    nextAntiqueSprintAt: 0,
    antiqueSprintUntil: 0,
    antiqueLastWallHitAt: 0,
    antiqueWallCombo: 0,
    antiqueWallStopTier: 0,
    nextMedicAdrenalineAt: 0,
    nextFlywheelAt: 0,
    nextKneeJerkWindowAt: 0,
    nextKneeJerkPalletAt: 0,
    kneeJerkBoostUntil: 0,
    nextGeneralRideAt: 0,
    generalRideUntil: 0,
    generalRideWhips: 0,
    nextGeneralWhipAt: 0,
    generalRage: 0,
    nextShieldGuardAt: 0,
    shieldGuardUntil: 0,
    nextShieldToughnessAt: 0,
    shieldTwinTimeImmuneUntil: 0,
    mirrorTeleportReadyAt: 0,
    mirrorBlindUntil: 0,
    mirrorNoHeartbeatSince: 0,
    perfumeBoostUntil: 0,
    perfumeUltimateCharges: 0,
    tunerResonance: 0,
    fencerStrideMarks: [],
    fencerLastSprintAngle: null,
    fencerNextStrideAt: 0,
    fencerLungePreparing: false,
    fencerLungePreparingAt: 0,
    magicShowMode: "rescue",
    wanderTarget: null,
    kiteDecision: null,
    healDecision: null,
    objectiveDecision: null,
    messengerSupport: null,
    quickChatDirective: null,
    navigationChannelDirective: null,
    kiteEscapeOverride: null,
    path: [],
    pathGoal: null,
    repathAt: 0
  };

  const teammates = [
    createAISurvivor("队友1", 1120, 380, "#b7d6c1", "#5aa475"),
    createAISurvivor("队友2", 460, 1260, "#c9d6f2", "#6d8fd4"),
    createAISurvivor("队友3", 1720, 1180, "#f0cfb7", "#c87f55")
  ];

  const hunter = {
    kind: "hunter",
    characterId: "standard",
    x: 960,
    y: 360,
    radius: 25,
    speed: 304,
    vx: 0,
    vy: 0,
    turnSpeed: Math.PI * 1.8,
    attackRange: 86,
    attackArc: Math.PI,
    attackCooldown: 0.65,
    attackWindup: 0.16,
    lastAttackAt: -10000,
    wipeUntil: 0,
    lastAttackHit: false,
    stunnedUntil: 0,
    stopAttackUntil: 0,
    presenceHits: 0,
    presenceTier: 0,
    rampagePresenceGained: 0,
    nextRampageAt: 0,
    nextCriticalPointAt: 0,
    wantedTarget: null,
    wantedUntil: 0,
    trumpCardUsed: false,
    trumpCardSelecting: false,
    trumpCardSelectionUntil: 0,
    excitementGuardUntil: 0,
    mirrorTeleportReadyAt: 0,
    mirrorBlindUntil: 0,
    mirrorNoHeartbeatSince: 0,
    nextMirrorCurtainAt: 0,
    nextMirrorLightAt: 0,
    nextDanceStepAt: 0,
    nextDanceSpinAt: 0,
    nextInfiniteDanceAt: 0,
    infiniteDanceUntil: 0,
    nextEdictTrapAt: 0,
    nextEdictHookAt: 0,
    nextAbyssTentacleAt: 0,
    nextAbyssFormAt: 0,
    abyssFormUntil: 0,
    nextAbyssWhisperAt: 0,
    nextAbyssProjectionAt: 0,
    abyssValue: 0,
    abyssGazeProgress: 0,
    abyssSenseTargets: [],
    nextHoundAt: 0,
    nextHammerShockAt: 0,
    nextGhostfireAt: 0,
    nextShadowTeleportAt: 0,
    nextSawDashAt: 0,
    nextSoulSiphonAt: 0,
    soulSiphonTarget: null,
    soulSiphonUntil: 0,
    soulSiphonPenaltyUntil: 0,
    nextBorrowSoulAt: 0,
    borrowSoulUntil: 0,
    borrowSoulSpeedBonus: 0,
    borrowSoulRecoveryBonus: 0,
    nextSoulPatrolAt: 0,
    soulPatrolUntil: 0,
    soulPatrolPoint: null,
    soulPatrolFloatReady: false,
    soulPatrolInstantVaultsLeft: 0,
    soulPatrolEmpowered: false,
    soulSelectionMode: null,
    soulSelectionCandidate: null,
    soulSelectionCount: 0,
    soulSelectionAt: 0,
    sawAttackLockedUntil: 0,
    shortSawAvailableUntil: 0,
    pendingSawWipe: false,
    pendingSawWipeAt: 0,
    action: null,
    angle: Math.PI,
    status: "chasing",
    target: null,
    targetLock: null,
    targetLockUntil: 0,
    lastTargetHitAt: 0,
    blindWanderAngle: Math.PI,
    nextBlindWanderTurnAt: 0,
    lastKnownTargetX: null,
    lastKnownTargetY: null,
    carrying: null,
    path: [],
    pathGoal: null,
    repathAt: 0
  };

  const camera = {
    x: 0,
    y: 0,
    zoom: 1
  };

  const input = {
    up: false,
    down: false,
    left: false,
    right: false,
    sprint: false,
    touchX: 0,
    touchY: 0,
    directionKeyMap: {}
  };

  const walls = [
    rect(0, 0, world.width, 54),
    rect(0, world.height - 54, world.width, 54),
    rect(0, 0, 54, world.height),
    rect(world.width - 54, 0, 54, world.height),
    rect(250, 190, 360, 70),
    rect(760, 170, 92, 390),
    rect(1010, 170, 430, 76),
    rect(1650, 160, 92, 360),
    rect(330, 470, 90, 420),
    rect(540, 620, 460, 80),
    rect(1210, 460, 90, 520),
    rect(1450, 640, 410, 78),
    rect(1900, 480, 80, 430),
    rect(170, 1030, 420, 80),
    rect(760, 930, 88, 420),
    rect(1020, 1120, 360, 86),
    rect(610, 190, 40, 70),
    rect(720, 190, 40, 70),
    rect(1000, 620, 50, 80),
    rect(1140, 620, 70, 80),
    rect(590, 1030, 40, 80),
    rect(720, 1030, 40, 80),
    rect(1440, 1120, 40, 86),
    rect(1560, 1120, 40, 86),
    rect(1890, 1124, 44, 72),
    rect(2006, 1124, 44, 72),
    rect(1760, 1464, 44, 72),
    rect(1876, 1464, 44, 72),
    rect(2050, 1204, 44, 72),
    rect(2166, 1204, 44, 72),
    rect(2070, 1564, 44, 72),
    rect(2186, 1564, 44, 72)
  ];

  const pallets = [
    prop(685, 225, 82, 10, 0, "standing"),
    prop(1095, 660, 92, 10, 0, "standing"),
    prop(675, 1070, 92, 10, 0, "standing"),
    prop(1520, 1163, 84, 10, 0, "standing"),
    prop(1970, 1160, 68, 10, 0, "standing"),
    prop(1840, 1500, 68, 10, 0, "standing"),
    prop(2130, 1240, 68, 10, 0, "standing"),
    prop(2150, 1600, 68, 10, 0, "standing")
  ];

  const windows = [
    prop(390, 225, 118, 44, 0, "window"),
    prop(806, 350, 44, 118, 0, "window"),
    prop(1220, 208, 118, 44, 0, "window"),
    prop(1696, 320, 44, 118, 0, "window"),
    prop(375, 685, 44, 118, 0, "window"),
    prop(750, 660, 118, 44, 0, "window"),
    prop(1255, 700, 44, 118, 0, "window"),
    prop(360, 1070, 118, 44, 0, "window"),
    prop(805, 1140, 44, 118, 0, "window")
  ];

  const repairPoints = [
    objective(585, 360),
    objective(1130, 375),
    objective(1800, 330),
    objective(1040, 850),
    objective(440, 1270),
    objective(1620, 1320),
    objective(1980, 1120),
    objective(2120, 1500),
    objective(2250, 820)
  ];

  const exitGates = [
    exitGate(190, 720),
    exitGate(2240, 1460)
  ];

  const hatch = {
    x: 1510,
    y: 1510,
    spawned: false,
    opened: false
  };

  const chairs = [
    chair(190, 320), chair(520, 320), chair(910, 330), chair(1450, 320), chair(1970, 330),
    chair(220, 560), chair(700, 520), chair(1120, 520), chair(1530, 520), chair(2190, 650),
    chair(260, 860), chair(650, 830), chair(1110, 900), chair(1540, 850), chair(2040, 1060),
    chair(360, 1320), chair(1180, 1320), chair(1730, 1440), chair(2220, 1300), chair(2260, 1600)
  ];

  expandCenterClearingLayout();

  let width = 0;
  let height = 0;
  let dpr = 1;
  let lastTime = performance.now();
  let lastAIUpdateAt = lastTime;
  let lastAIHunterUpdateAt = lastTime;
  let lastHudUpdateAt = -Infinity;
  let chasePulseUntil = 0;
  let selectedRole = null;
  let quickChatRecipient = null;
  let quickChatOpen = false;
  let pendingRole = null;
  let currentMode = GAME_MODE.normal;
  let pendingMode = null;
  let kiteSimulatorNoCooldown = false;
  let selectedSurvivorCharacter = CLOCKMAKER_ID;
  let selectedHunterCharacter = LANTERN_KEEPER_ID;
  let selectedCharacterForSetup = null;
  let setupStep = "character";
  let hiddenHunterUnlocked = readHiddenHunterUnlock();
  let profileUnlocks = readProfileUnlocks();
  let profileTaskProgress = readProfileTaskProgress();
  let playerChaseTaskState = null;
  const pendingSafeRescueTasks = [];
  let hiddenUnlockBuffer = "";
  let twinAim = null;
  let twinShadowZoneId = 0;
  let twinSwordProjectileId = 0;
  let matchStarted = false;
  let matchStartedAt = 0;
  let matchResult = null;
  let firstSurvivorInjuryOccurred = false;
  let tunerFirstCipherBeforeInjuryRecorded = false;
  let selectedSurvivorBadges = [];
  let selectedHunterBadges = [];
  let selectedHunterAssist = "listen";
  let previewSurvivorCharacterOrder = null;
  let nextSoulLampAt = 0;
  let lanternAlert = null;
  let soulLampId = 0;
  let assistPeeperId = 0;
  let activePatroller = null;
  let activeShiftPortals = null;
  let assistListenTargets = [];
  let finalCipherGuard = null;
  let aiTeamPlan = { until: 0, rescuer: null, gateOpener: null, repairLead: null };
  let packageProjectileId = 0;
  let navigationChannelId = 0;
  let packageAim = null;
  let edictHookAim = null;
  let abyssTentacleAim = null;
  let navigationChannelAim = null;
  let actorRescuePhantomAim = null;
  let lastAimPointer = null;
  let stitchPackDropId = 0;
  let actorDecoyId = 0;
  let perfumeMistId = 0;
  let mirrorRiftId = 0;
  let mirrorCurtainId = 0;
  let collisionRectsCache = null;
  let danceLineId = 0;
  let pendingDancePoint = null;
  let pendingDanceLine = null;
  let dancePointAim = null;
  let mirrorCurtainAim = null;
  const antiqueEffects = [];
  const soulLamps = [];
  const assistPeeperWards = [];
  const packageProjectiles = [];
  const navigationChannels = [];
  const ghostfireProjectiles = [];
  const edictTraps = [];
  const edictHooks = [];
  const abyssTentacles = [];
  const abyssProjections = [];
  const huntingHounds = [];
  const hammerShockEffects = [];
  const stitchPackDrops = [];
  const actorDecoys = [];
  const perfumeMists = [];
  const tunerEchoLines = [];
  const mirrorRifts = [];
  const mirrorCurtains = [];
  const danceLines = [];
  const twinShadowZones = [];
  const twinSwordProjectiles = [];
  const DEVICE_ASSET_ROOT = `${window.location.pathname.includes("/demos/") ? "../" : "./"}assets/devices/`;
  const DEVICE_IMAGES = createDeviceImages({
    repair: "repair-machine.png",
    chair: "rocket-chair.png",
    gate: "exit-gate.png",
    hatchClosed: "hatch-closed.png",
    hatchOpen: "hatch-open.png"
  });
  const CHARACTER_ASSET_ROOT = `${window.location.pathname.includes("/demos/") ? "../" : "./"}assets/游戏图样/角色/optimized/`;
  const CHARACTER_ASSET_VERSION = "edictor-portrait-20260816";
  const CHARACTER_SPRITE_CACHE = {};
  const CHARACTER_WARMUP_QUEUE = [];
  let characterWarmupScheduled = false;
  let matchSpritePreparationId = 0;
  const CHARACTER_IMAGES = createCharacterImages({
    mirrorGhost: "镜鬼Q版.png",
    clockmaker: "钟表匠Q版.png",
    actor: "演员Q版.png",
    messenger: "信使Q版.png",
    apprentice: "学徒Q版.png",
    antiqueDealer: "古董商Q版.png",
    navigator: "引航员Q版.png",
    medic: "军医Q版.png",
    perfumer: "调香师Q版.png",
    tuner: "调律师Q版.png",
    fencer: "击剑手Q版.png",
    general: "将军.png",
    generalRide: "将军骑马.png",
    lanternKeeper: "提灯人Q版.png",
    edictor: "禁令官Q版.png",
    sawbone: "锯骨Q版.png",
    soulBinder: "引魂师Q版.png",
    dancer: "舞者Q版.png",
    twinQingtian: "赵青天Q版.png",
    twinChiyin: "池音Q版.png"
  });

  function createDeviceImages(files) {
    return Object.fromEntries(Object.entries(files).map(([key, file]) => {
      const image = new Image();
      image.decoding = "async";
      image.src = `${DEVICE_ASSET_ROOT}${file}`;
      return [key, image];
    }));
  }

  function createCharacterImages(files) {
    return Object.fromEntries(Object.entries(files).map(([key, file]) => {
      const image = new Image();
      image.decoding = "async";
      image.src = encodeURI(`${CHARACTER_ASSET_ROOT}${file}?v=${CHARACTER_ASSET_VERSION}`);
      image.addEventListener("load", () => warmCharacterSprite(key, image), { once: true });
      return [key, image];
    }));
  }

  function warmCharacterSprite(key, image) {
    CHARACTER_WARMUP_QUEUE.push({ key, image });
    scheduleCharacterWarmup();
  }

  function prepareCharacterSprite(key) {
    const image = CHARACTER_IMAGES[key];
    if (!key || !image) return Promise.resolve();
    const cacheSprite = () => {
      if (!CHARACTER_SPRITE_CACHE[key] && image.complete && image.naturalWidth) {
        CHARACTER_SPRITE_CACHE[key] = buildCharacterSprite(image, key);
      }
    };
    if (image.complete) {
      cacheSprite();
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        cacheSprite();
        resolve();
      };
      image.addEventListener("load", finish, { once: true });
      image.addEventListener("error", finish, { once: true });
      window.setTimeout(finish, 3000);
    });
  }

  function prepareCurrentMatchSprites() {
    const keys = new Set([
      getCharacterImageKey(hunter, "hunter"),
      ...getSurvivors().map((survivor) => getCharacterImageKey(survivor, "survivor"))
    ].filter(Boolean));
    return Promise.all(Array.from(keys, prepareCharacterSprite));
  }

  function beginPreparedMatch() {
    const preparationId = ++matchSpritePreparationId;
    matchStarted = false;
    prepareCurrentMatchSprites().then(() => {
      if (preparationId !== matchSpritePreparationId) return;
      matchStarted = true;
      setRoleOverlayVisible(false);
    });
  }

  function scheduleCharacterWarmup() {
    if (characterWarmupScheduled) return;
    characterWarmupScheduled = true;
    const run = () => {
      characterWarmupScheduled = false;
      const item = CHARACTER_WARMUP_QUEUE.shift();
      if (!item) return;
      const { key, image } = item;
      if (!CHARACTER_SPRITE_CACHE[key] && image.complete && image.naturalWidth) {
        CHARACTER_SPRITE_CACHE[key] = buildCharacterSprite(image, key);
      }
      if (CHARACTER_WARMUP_QUEUE.length) {
        window.setTimeout(scheduleCharacterWarmup, 140);
      }
    };
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(run, { timeout: 1200 });
    } else {
      window.setTimeout(run, 80);
    }
  }

  function rect(x, y, w, h) {
    return { x, y, w, h };
  }

  function prop(x, y, w, h, angle, label) {
    return { x, y, w, h, angle, label };
  }

  function objective(x, y) {
    return { x, y, progress: 0, completed: false, workers: [] };
  }

  function exitGate(x, y) {
    return { x, y, label: "exit", progress: 0, opened: false, workers: [] };
  }

  function chair(x, y) {
    return { x, y, survivor: null, destroyed: false };
  }

  function cloneMapItem(item) {
    return { ...item };
  }

  function captureCurrentMapLayout(id, name, theme) {
    return {
      id,
      name,
      theme,
      width: world.width,
      height: world.height,
      walls: walls.map(cloneMapItem),
      pallets: pallets.map(cloneMapItem),
      windows: windows.map(cloneMapItem),
      repairPoints: repairPoints.map(({ x, y }) => objective(x, y)),
      exitGates: exitGates.map(({ x, y }) => exitGate(x, y)),
      hatch: { x: hatch.x, y: hatch.y },
      chairs: chairs.map(({ x, y }) => chair(x, y))
    };
  }

  function createHospitalMapLayout() {
    const layout = captureCurrentMapLayout("abandonedHospital", "废弃医院", "hospital");
    expandHospitalSoutheastLot(layout);
    return layout;
  }

  function expandHospitalSoutheastLot(layout) {
    const border = 54;
    layout.width = 3000;
    layout.height = 2200;
    const internalWalls = layout.walls.slice(4);
    layout.walls = [
      rect(0, 0, layout.width, border),
      rect(0, layout.height - border, layout.width, border),
      rect(0, 0, border, layout.height),
      rect(layout.width - border, 0, border, layout.height)
    ].concat(internalWalls);
    relocateHospitalCenterStructures(layout);
    addHospitalCornerBuilding(layout, 1170, 860);
    addHospitalLotPallet(layout, 720, 1420, 82, 0);
    addHospitalLotPallet(layout, 980, 1530, 78, Math.PI / 2);
    addHospitalLotPallet(layout, 2180, 880, 86, 0);
    addHospitalLotPallet(layout, 2600, 1120, 82, Math.PI / 2);
    layout.walls.push(
      rect(300, 1440, 210, 46),
      rect(530, 1660, 230, 42),
      rect(2020, 920, 46, 180),
      rect(2740, 760, 46, 190)
    );
    removeHospitalPalletWallOverlaps(layout);
    relocateHospitalBlockedRepairPoints(layout);
    relocateHospitalBlockedChairs(layout);
  }

  function relocateHospitalBlockedRepairPoints(layout) {
    layout.repairPoints.forEach((point) => {
      if (!isHospitalRepairPointBlocked(layout, point.x, point.y)) return;
      const destination = findHospitalRepairRelocation(layout, point);
      if (!destination) return;
      point.x = destination.x;
      point.y = destination.y;
    });
  }

  function isHospitalRepairPointBlocked(layout, x, y) {
    const clearance = 78;
    return layout.walls.some((wall) => x + clearance > wall.x && x - clearance < wall.x + wall.w && y + clearance > wall.y && y - clearance < wall.y + wall.h);
  }

  function findHospitalRepairRelocation(layout, repairPoint) {
    const candidates = [];
    for (let y = 180; y <= layout.height - 180; y += 160) {
      for (let x = 180; x <= layout.width - 180; x += 160) {
        if (isHospitalRepairPointBlocked(layout, x, y)) continue;
        if (layout.repairPoints.some((other) => other !== repairPoint && Math.hypot(other.x - x, other.y - y) < 340)) continue;
        if (layout.exitGates.some((gate) => Math.hypot(gate.x - x, gate.y - y) < 220)) continue;
        if (Math.hypot(layout.hatch.x - x, layout.hatch.y - y) < 190) continue;
        if (layout.chairs.some((chairItem) => Math.hypot(chairItem.x - x, chairItem.y - y) < 120)) continue;
        if (layout.windows.concat(layout.pallets).some((item) => Math.hypot(item.x - x, item.y - y) < Math.max(item.w, item.h) * 0.5 + 94)) continue;
        candidates.push({ x, y });
      }
    }
    return shuffled(candidates)[0] || null;
  }

  function relocateHospitalBlockedChairs(layout) {
    layout.chairs.forEach((chairItem) => {
      if (!isHospitalRepairPointBlocked(layout, chairItem.x, chairItem.y)) return;
      const destination = findHospitalChairRelocation(layout, chairItem);
      if (!destination) return;
      chairItem.x = destination.x;
      chairItem.y = destination.y;
    });
  }

  function findHospitalChairRelocation(layout, chairItem) {
    const candidates = [];
    for (let y = 160; y <= layout.height - 160; y += 160) {
      for (let x = 160; x <= layout.width - 160; x += 160) {
        if (isHospitalRepairPointBlocked(layout, x, y)) continue;
        if (layout.chairs.some((other) => other !== chairItem && Math.hypot(other.x - x, other.y - y) < 180)) continue;
        if (layout.repairPoints.some((point) => Math.hypot(point.x - x, point.y - y) < 150)) continue;
        if (layout.exitGates.some((gate) => Math.hypot(gate.x - x, gate.y - y) < 190)) continue;
        if (Math.hypot(layout.hatch.x - x, layout.hatch.y - y) < 160) continue;
        if (layout.windows.concat(layout.pallets).some((item) => Math.hypot(item.x - x, item.y - y) < Math.max(item.w, item.h) * 0.5 + 76)) continue;
        candidates.push({ x, y });
      }
    }
    return shuffled(candidates)[0] || null;
  }

  function removeHospitalPalletWallOverlaps(layout) {
    const removedSupportIds = new Set();
    layout.pallets = layout.pallets.filter((pallet) => {
      const vertical = Math.abs(Math.sin(pallet.angle || 0)) > 0.7;
      const halfWidth = vertical ? pallet.h * 0.5 : pallet.w * 0.5;
      const halfHeight = vertical ? pallet.w * 0.5 : pallet.h * 0.5;
      const overlapsWall = layout.walls.some((wall) => {
        const overlapX = Math.min(pallet.x + halfWidth, wall.x + wall.w) - Math.max(pallet.x - halfWidth, wall.x);
        const overlapY = Math.min(pallet.y + halfHeight, wall.y + wall.h) - Math.max(pallet.y - halfHeight, wall.y);
        const longOverlap = vertical ? overlapY : overlapX;
        const thickOverlap = vertical ? overlapX : overlapY;
        return longOverlap > 16 && thickOverlap > 3;
      });
      if (overlapsWall && pallet.supportId) removedSupportIds.add(pallet.supportId);
      return !overlapsWall;
    });
    if (removedSupportIds.size > 0) {
      layout.walls = layout.walls.filter((wall) => !removedSupportIds.has(wall.supportForPallet));
    }
  }

  function relocateHospitalCenterStructures(layout) {
    const source = { left: 1000, top: 440, right: 2060, bottom: 1220 };
    const target = { x: 1880, y: 1410 };
    const shiftX = target.x - source.left;
    const shiftY = target.y - source.top;
    ["walls", "pallets", "windows"].forEach((key) => {
      const moved = [];
      layout[key] = layout[key].filter((item) => {
        const centerX = item.x + (item.w || 0) * 0.5;
        const centerY = item.y + (item.h || 0) * 0.5;
        const inside = centerX >= source.left && centerX <= source.right && centerY >= source.top && centerY <= source.bottom;
        if (inside) moved.push(item);
        return !inside;
      });
      layout[key].push(...moved.map((item) => ({ ...item, x: item.x + shiftX, y: item.y + shiftY })));
    });
  }

  function addHospitalLotPallet(layout, x, y, width, angle) {
    const supportId = `hospital-lot-pallet-${layout.pallets.length}`;
    layout.pallets.push({ ...prop(x, y, width, 10, angle, "standing"), supportId });
    const sideLength = 76;
    const thickness = 22;
    const supportWall = (wallX, wallY, wallWidth, wallHeight) => ({ ...rect(wallX, wallY, wallWidth, wallHeight), supportForPallet: supportId });
    if (Math.abs(angle - Math.PI / 2) < 0.1) {
      layout.walls.push(
        supportWall(x - thickness / 2, y - width / 2 - sideLength - 12, thickness, sideLength),
        supportWall(x - thickness / 2, y + width / 2 + 12, thickness, sideLength)
      );
      return;
    }
    layout.walls.push(
      supportWall(x - width / 2 - sideLength - 12, y - thickness / 2, sideLength, thickness),
      supportWall(x + width / 2 + 12, y - thickness / 2, sideLength, thickness)
    );
  }

  function addHospitalCornerBuilding(layout, originX = 2240, originY = 1620) {
    const shiftX = originX - 2240;
    const shiftY = originY - 1620;
    const wall = (x, y, w, h) => rect(x + shiftX, y + shiftY, w, h);
    const window = (x, y, w, h, angle) => prop(x + shiftX, y + shiftY, w, h, angle, "window");
    layout.walls.push(
      wall(2240, 1620, 260, 54),
      wall(2618, 1620, 286, 54),
      wall(2240, 2060, 260, 54),
      wall(2618, 2060, 286, 54),
      wall(2240, 1620, 54, 180),
      wall(2240, 1918, 54, 196),
      wall(2850, 1620, 54, 494),
      wall(2420, 1780, 370, 42),
      wall(2420, 1940, 42, 130),
      wall(2660, 1940, 42, 130)
    );
    layout.windows.push(
      window(2559, 1626, 118, 44, 0),
      window(2250, 1859, 44, 118, 0)
    );
    addHospitalInteriorPallet(layout, 2670 + shiftX, 1725 + shiftY, 84, 0);
    addHospitalInteriorPallet(layout, 2355 + shiftX, 1915 + shiftY, 78, Math.PI / 2);
    addHospitalInteriorPallet(layout, 2775 + shiftX, 1915 + shiftY, 78, Math.PI / 2);
    addHospitalInteriorPallet(layout, 2561 + shiftX, 1998 + shiftY, 82, 0);
  }

  function addHospitalInteriorPallet(layout, x, y, width, angle) {
    const supportId = `hospital-interior-pallet-${layout.pallets.length}`;
    layout.pallets.push({ ...prop(x, y, width, 10, angle, "standing"), supportId });
    const sideLength = 42;
    const thickness = 20;
    const supportWall = (wallX, wallY, wallWidth, wallHeight) => ({ ...rect(wallX, wallY, wallWidth, wallHeight), supportForPallet: supportId });
    if (Math.abs(angle - Math.PI / 2) < 0.1) {
      layout.walls.push(
        supportWall(x - thickness / 2, y - width / 2 - sideLength - 10, thickness, sideLength),
        supportWall(x - thickness / 2, y + width / 2 + 10, thickness, sideLength)
      );
      return;
    }
    layout.walls.push(
      supportWall(x - width / 2 - sideLength - 10, y - thickness / 2, sideLength, thickness),
      supportWall(x + width / 2 + 10, y - thickness / 2, sideLength, thickness)
    );
  }

  function createLegacyHospitalMapLayout() {
    return {
      id: "abandonedHospital",
      name: "废弃医院",
      theme: "hospital",
      walls: [
        rect(0, 0, world.width, 54),
        rect(0, world.height - 54, world.width, 54),
        rect(0, 0, 54, world.height),
        rect(world.width - 54, 0, 54, world.height),
        rect(260, 170, 500, 72),
        rect(960, 150, 460, 72),
        rect(1660, 170, 420, 72),
        rect(260, 410, 84, 430),
        rect(470, 360, 88, 300),
        rect(680, 450, 430, 78),
        rect(1290, 350, 84, 470),
        rect(1540, 450, 470, 78),
        rect(2140, 360, 84, 360),
        rect(420, 770, 320, 74),
        rect(920, 710, 84, 410),
        rect(1170, 820, 400, 82),
        rect(1690, 760, 84, 410),
        rect(1990, 920, 270, 76),
        rect(190, 1160, 520, 78),
        rect(850, 1120, 86, 420),
        rect(1110, 1260, 420, 80),
        rect(1700, 1330, 470, 78),
        rect(340, 1340, 72, 220),
        rect(560, 1420, 72, 210),
        rect(1280, 1450, 72, 210),
        rect(1510, 1450, 72, 210),
        rect(2020, 1500, 72, 160),
        rect(432, 220, 86, 140),
        rect(626, 220, 86, 140),
        rect(1048, 210, 88, 140),
        rect(1216, 210, 88, 140),
        rect(1744, 220, 86, 140),
        rect(1904, 220, 86, 140),
        rect(752, 500, 86, 112),
        rect(922, 500, 86, 112),
        rect(1618, 500, 86, 112),
        rect(1788, 500, 86, 112),
        rect(420, 970, 260, 72),
        rect(1960, 720, 210, 110)
      ],
      pallets: [
        prop(572, 308, 82, 10, 0, "standing"),
        prop(1176, 296, 82, 10, 0, "standing"),
        prop(1864, 308, 82, 10, 0, "standing"),
        prop(880, 590, 82, 10, 0, "standing"),
        prop(1748, 590, 82, 10, 0, "standing"),
        prop(580, 725, 86, 10, 0, "standing"),
        prop(1430, 790, 86, 10, 0, "standing"),
        prop(2124, 1015, 72, 10, 0, "standing"),
        prop(630, 1110, 88, 10, 0, "standing"),
        prop(1320, 1210, 88, 10, 0, "standing"),
        prop(1936, 1420, 84, 10, 0, "standing"),
        prop(1395, 1490, 72, 10, 0, "standing")
      ],
      windows: [
        prop(510, 206, 118, 44, 0, "window"),
        prop(1190, 188, 118, 44, 0, "window"),
        prop(1870, 206, 118, 44, 0, "window"),
        prop(302, 620, 44, 118, 0, "window"),
        prop(514, 510, 44, 118, 0, "window"),
        prop(895, 488, 118, 44, 0, "window"),
        prop(1332, 560, 44, 118, 0, "window"),
        prop(1790, 488, 118, 44, 0, "window"),
        prop(2182, 530, 44, 118, 0, "window"),
        prop(962, 900, 44, 118, 0, "window"),
        prop(1370, 862, 118, 44, 0, "window"),
        prop(1732, 960, 44, 118, 0, "window"),
        prop(450, 1200, 118, 44, 0, "window"),
        prop(892, 1350, 44, 118, 0, "window"),
        prop(1320, 1300, 118, 44, 0, "window"),
        prop(2060, 1370, 118, 44, 0, "window")
      ],
      repairPoints: [
        objective(760, 390),
        objective(1210, 390),
        objective(1880, 370),
        objective(820, 700),
        objective(1510, 710),
        objective(2210, 1120),
        objective(720, 1500),
        objective(1230, 1110),
        objective(1840, 1540)
      ],
      exitGates: [
        exitGate(170, 980),
        exitGate(2235, 310)
      ],
      hatch: {
        x: 1510,
        y: 1090
      },
      chairs: [
        chair(210, 300), chair(820, 300), chair(1500, 300), chair(2180, 300),
        chair(210, 650), chair(610, 610), chair(1180, 610), chair(1490, 610), chair(2040, 650),
        chair(320, 950), chair(760, 910), chair(1120, 980), chair(1580, 1010), chair(2220, 1050),
        chair(250, 1450), chair(790, 1540), chair(1140, 1470), chair(1640, 1520), chair(1980, 1220), chair(2250, 1520)
      ]
    };
  }

  function replaceMapArray(target, source) {
    target.splice(0, target.length, ...source.map(cloneMapItem));
  }

  function applyMapLayout(layout) {
    world.width = layout.width || BASE_WORLD_WIDTH;
    world.height = layout.height || BASE_WORLD_HEIGHT;
    nav.cols = Math.ceil(world.width / nav.cell);
    nav.rows = Math.ceil(world.height / nav.cell);
    replaceMapArray(walls, layout.walls);
    replaceMapArray(pallets, layout.pallets);
    replaceMapArray(windows, layout.windows);
    replaceMapArray(repairPoints, layout.repairPoints.map(({ x, y }) => objective(x, y)));
    replaceMapArray(exitGates, layout.exitGates.map(({ x, y }) => exitGate(x, y)));
    replaceMapArray(chairs, layout.chairs.map(({ x, y }) => chair(x, y)));
    hatch.x = layout.hatch.x;
    hatch.y = layout.hatch.y;
    hatch.spawned = false;
    hatch.opened = false;
    currentMapLayout = layout;
    invalidateCollisionRects();
  }

  function applyRandomMapLayout() {
    const options = MAP_LAYOUTS;
    const picked = options[Math.floor(Math.random() * options.length)] || options[0];
    applyMapLayout(picked);
  }

  let currentMapLayout = null;
  const MAP_LAYOUTS = [
    captureCurrentMapLayout("oldEstate", "旧庄园", "estate"),
    createHospitalMapLayout()
  ];

  function scaleMapLayout() {
    if (!SCALE_EXISTING_MAP_LAYOUT || MAP_SCALE === 1) return;
    walls.slice(4).forEach(scaleRectCenterFromBaseWorld);
    pallets.forEach(scalePositionFromBaseWorld);
    windows.forEach(scalePositionFromBaseWorld);
    repairPoints.forEach(scalePositionFromBaseWorld);
    exitGates.forEach(scalePositionFromBaseWorld);
    chairs.forEach(scalePositionFromBaseWorld);
    scalePositionFromBaseWorld(hatch);
    [player, hunter, ...teammates].forEach(scaleActorStartFromBaseWorld);
  }

  function expandCenterClearingLayout() {
    if (!CENTER_CLEARING_EXTRA_X && !CENTER_CLEARING_EXTRA_Y) return;
    walls.slice(4).forEach(shiftRectFromBaseCenter);
    pallets.forEach(shiftPositionFromBaseCenter);
    windows.forEach(shiftPositionFromBaseCenter);
    repairPoints.forEach(shiftPositionFromBaseCenter);
    exitGates.forEach(shiftPositionFromBaseCenter);
    chairs.forEach(shiftPositionFromBaseCenter);
    shiftPositionFromBaseCenter(hatch);
    [player, hunter, ...teammates].forEach(shiftActorStartFromBaseCenter);
  }

  function shiftPositionFromBaseCenter(item) {
    if (item.x >= BASE_WORLD_WIDTH / 2) item.x += CENTER_CLEARING_EXTRA_X;
    if (item.y >= BASE_WORLD_HEIGHT / 2) item.y += CENTER_CLEARING_EXTRA_Y;
    return item;
  }

  function shiftRectFromBaseCenter(item) {
    const centerX = item.x + item.w / 2;
    const centerY = item.y + item.h / 2;
    if (centerX >= BASE_WORLD_WIDTH / 2) item.x += CENTER_CLEARING_EXTRA_X;
    if (centerY >= BASE_WORLD_HEIGHT / 2) item.y += CENTER_CLEARING_EXTRA_Y;
    return item;
  }

  function shiftActorStartFromBaseCenter(actor) {
    shiftPositionFromBaseCenter(actor);
    actor.initialX = actor.x;
    actor.initialY = actor.y;
  }

  function scalePositionFromBaseWorld(item) {
    const oldCenterX = BASE_WORLD_WIDTH / 2;
    const oldCenterY = BASE_WORLD_HEIGHT / 2;
    const newCenterX = world.width / 2;
    const newCenterY = world.height / 2;
    item.x = newCenterX + (item.x - oldCenterX) * MAP_SCALE;
    item.y = newCenterY + (item.y - oldCenterY) * MAP_SCALE;
    return item;
  }

  function scaleRectCenterFromBaseWorld(item) {
    const center = {
      x: item.x + item.w / 2,
      y: item.y + item.h / 2
    };
    const oldCenterX = BASE_WORLD_WIDTH / 2;
    const oldCenterY = BASE_WORLD_HEIGHT / 2;
    const newCenterX = world.width / 2;
    const newCenterY = world.height / 2;
    const scaledCenterX = newCenterX + (center.x - oldCenterX) * MAP_SCALE;
    const scaledCenterY = newCenterY + (center.y - oldCenterY) * MAP_SCALE;
    item.x = scaledCenterX - item.w / 2;
    item.y = scaledCenterY - item.h / 2;
    return item;
  }

  function scaleActorStartFromBaseWorld(actor) {
    scalePositionFromBaseWorld(actor);
    actor.initialX = actor.x;
    actor.initialY = actor.y;
  }

  function createAISurvivor(name, x, y, fill, core) {
    return {
      name,
      kind: "ai",
      characterId: CLOCKMAKER_ID,
      initialX: x,
      initialY: y,
      x,
      y,
      radius: 22,
      speed: player.speed,
      sprintSpeed: player.sprintSpeed,
      vx: 0,
      vy: 0,
      stamina: 100,
      angle: 0,
      state: "healthy",
      healProgress: 0,
      damageProgress: 0,
      selfHealUsed: false,
      bleedStacks: [],
      soulMarks: 0,
      chairProgress: 0,
      chairProgressPausedUntil: 0,
      injuredAt: null,
      downedAt: null,
      nextChairEliminates: false,
      carryProgress: 0,
      chair: null,
      boostUntil: 0,
      endgameBoostUntil: 0,
      adrenalineTriggered: false,
      borrowedTimeUntil: 0,
      borrowedTimePendingDamage: 0,
      borrowedTimeUsed: false,
      nextPhysicianBenevolenceAt: 0,
      medicShieldUntil: 0,
      medicShieldHits: 0,
      medicShieldSource: null,
      medicAdrenalineUntil: 0,
      medicAdrenalinePendingDamage: 0,
      medicRescueShockPendingDamage: 0,
      medicFirstChaseUsed: false,
      medicFirstChaseUntil: 0,
      stitchPack: null,
      timeDevice: null,
      invisibleUntil: 0,
      action: null,
      fill,
      core,
      nextInteractAt: 0,
      nextPackageAt: 0,
      nextNavigationChannelAt: 0,
      nextNavigationChannelRideAt: 0,
      nextTimeRewindAt: 0,
      nextMagicShowAt: 0,
      nextRescuePhantomAt: 0,
      nextStitchPackAt: 0,
      nextPerfumeMistAt: 0,
      nextTunerEchoAt: 0,
      nextTunerCipherTuneAt: 0,
      nextTunerSorrowCalibrationAt: 0,
      nextFencerLungeAt: 0,
      nextFighterPunchAt: 0,
      fighterPunchStunCount: 0,
      fighterArenaUsed: false,
      antiqueFluteOpen: false,
      antiqueDurability: ANTIQUE_FLUTE_DURABILITY_MAX,
      antiqueFluteLockedUntil: 0,
      nextAntiqueSweepLeftAt: 0,
      nextAntiqueThrustAt: 0,
      nextAntiqueSweepRightAt: 0,
      nextAntiqueLeapAt: 0,
      nextAntiqueSprintAt: 0,
      antiqueSprintUntil: 0,
      antiqueLastWallHitAt: 0,
      antiqueWallCombo: 0,
      antiqueWallStopTier: 0,
      nextMedicAdrenalineAt: 0,
      nextFlywheelAt: 0,
      nextKneeJerkWindowAt: 0,
      nextKneeJerkPalletAt: 0,
      kneeJerkBoostUntil: 0,
      nextGeneralRideAt: 0,
      generalRideUntil: 0,
      generalRideWhips: 0,
      nextGeneralWhipAt: 0,
      generalRage: 0,
      nextShieldGuardAt: 0,
      shieldGuardUntil: 0,
      nextShieldToughnessAt: 0,
      shieldTwinTimeImmuneUntil: 0,
      mirrorTeleportReadyAt: 0,
      perfumeBoostUntil: 0,
      perfumeUltimateCharges: 0,
      tunerResonance: 0,
      fencerStrideMarks: [],
      fencerLastSprintAngle: null,
      fencerNextStrideAt: 0,
      fencerLungePreparing: false,
      fencerLungePreparingAt: 0,
      magicShowMode: "rescue",
      wanderTarget: null,
      kiteDecision: null,
      healDecision: null,
      objectiveDecision: null,
      messengerSupport: null,
      quickChatDirective: null,
      navigationChannelDirective: null,
      kiteEscapeOverride: null,
      path: [],
      pathGoal: null,
    repathAt: 0
  };
  }

  function getSurvivors() {
    return [player].concat(teammates);
  }

  function getSurvivorCharacter(actor) {
    const characterId = actor && (actor.characterId || actor.owner && actor.owner.characterId);
    return SURVIVOR_CHARACTERS[characterId] || SURVIVOR_CHARACTERS.clockmaker;
  }

  function getSurvivorDisplayName(survivor) {
    return getSurvivorCharacter(survivor).name || survivor.name;
  }

  function isClockmaker(actor) {
    return actor && actor.characterId === CLOCKMAKER_ID;
  }

  function isActor(actor) {
    return actor && actor.characterId === ACTOR_ID;
  }

  function isMedic(actor) {
    return actor && actor.characterId === MEDIC_ID;
  }

  function isMessenger(actor) {
    return actor && actor.characterId === MESSENGER_ID;
  }

  function isApprentice(actor) {
    return actor && actor.characterId === APPRENTICE_ID;
  }

  function isNavigator(actor) {
    return actor && actor.characterId === NAVIGATOR_ID;
  }

  function isPerfumer(actor) {
    return actor && actor.characterId === PERFUMER_ID;
  }

  function isFencer(actor) {
    return actor && actor.characterId === FENCER_ID;
  }

  function isFighter(actor) {
    return actor && actor.characterId === FIGHTER_ID;
  }

  function isAntiqueDealer(actor) {
    return actor && actor.characterId === ANTIQUE_DEALER_ID;
  }

  function isGeneral(actor) {
    return actor && actor.characterId === GENERAL_ID;
  }

  function isShieldBearer(actor) {
    return actor && actor.characterId === SHIELD_BEARER_ID;
  }

  function isTuner(actor) {
    return actor && actor.characterId === TUNER_ID;
  }

  function hasSurvivorSkill(actor) {
    return isMessenger(actor) || isApprentice(actor) || isNavigator(actor) || isClockmaker(actor) || isActor(actor) || isMedic(actor) || isPerfumer(actor) || isFencer(actor) || isFighter(actor) || isAntiqueDealer(actor) || isGeneral(actor) || isShieldBearer(actor) || isTuner(actor);
  }

  function getSurvivorMultiplier(actor, key, fallback = 1) {
    const value = getSurvivorCharacter(actor)[key];
    const characterMultiplier = Number.isFinite(value) ? value : fallback;
    return characterMultiplier * getSurvivorBadgeMultiplier(actor, key);
  }

  function getSurvivorBadgeMultiplier(actor, key) {
    return getBadgeMultiplier(actor && actor.badges, BADGE_CONFIG.survivor, key);
  }

  function getHunterBadgeMultiplier(key) {
    return getBadgeMultiplier(hunter.badges, BADGE_CONFIG.hunter, key);
  }

  function getBadgeMultiplier(badges, config, key) {
    if (!Array.isArray(badges) || badges.length === 0) return 1;
    return badges.reduce((total, id) => {
      const badge = config[id];
      const value = badge && badge[key];
      return total * (Number.isFinite(value) ? value : 1);
    }, 1);
  }

  function getSelectedBadgesForRole(role) {
    return role === PLAYER_ROLE.hunter ? selectedHunterBadges : selectedSurvivorBadges;
  }

  function getBadgeNames(role, badges = getSelectedBadgesForRole(role)) {
    const config = role === PLAYER_ROLE.hunter ? BADGE_CONFIG.hunter : BADGE_CONFIG.survivor;
    return badges.map((id) => config[id] && config[id].name).filter(Boolean);
  }

  function getBadgeReadout(role, badges) {
    const names = getBadgeNames(role, badges);
    return names.length ? ` · 徽章${names.join("/")}` : "";
  }

  function getBadgeRarity(role, badgeId) {
    const badge = BADGE_CONFIG[role] && BADGE_CONFIG[role][badgeId];
    return badge && badge.rarity || "blue";
  }

  function countBadgesByRarity(role, badges, rarity) {
    return badges.filter((id) => getBadgeRarity(role, id) === rarity).length;
  }

  function hasHunterBadge(id) {
    return Array.isArray(hunter.badges) && hunter.badges.includes(id);
  }

  function hasSurvivorBadge(survivor, id) {
    return Boolean(survivor && Array.isArray(survivor.badges) && survivor.badges.includes(id));
  }

  function getHunterAssistConfig(id = hunter.assistSkill || selectedHunterAssist) {
    return HUNTER_ASSIST_SKILLS[id] || null;
  }

  function getHunterAssistName(id = hunter.assistSkill || selectedHunterAssist) {
    const config = getHunterAssistConfig(id);
    return config ? config.name : "辅助";
  }

  function hasHunterAssist() {
    return selectedRole === PLAYER_ROLE.hunter && Boolean(hunter.assistSkill) && !isInfiniteSawboneMode();
  }

  function getHunterAssistCooldownLeft(now = performance.now()) {
    return Math.max(0, (hunter.nextAssistAt || 0) - now);
  }

  function canUseTrumpCard(now = performance.now()) {
    return matchStarted &&
      selectedRole === PLAYER_ROLE.hunter &&
      hasHunterBadge("trumpCard") &&
      !hunter.trumpCardUsed &&
      !isInfiniteSawboneMode() &&
      !hunter.carrying &&
      !hunter.action &&
      now >= (hunter.wipeUntil || 0) &&
      now >= (hunter.stunnedUntil || 0);
  }

  function startTrumpCardSelection(now = performance.now()) {
    if (hunter.trumpCardSelecting) {
      hunter.trumpCardSelecting = false;
      showAssistAlert("取消底牌", now, 800);
      return true;
    }
    if (!canUseTrumpCard(now)) return false;
    hunter.trumpCardSelecting = true;
    hunter.trumpCardSelectionUntil = now + 8000;
    const options = HUNTER_ASSIST_ORDER.map((id, index) => `${index + 1}${HUNTER_ASSIST_SKILLS[id].name}`).join(" ");
    showAssistAlert(`底牌 ${options}`, now, 2600);
    return true;
  }

  function selectTrumpCardAssist(key, now = performance.now()) {
    if (!hunter.trumpCardSelecting || now > (hunter.trumpCardSelectionUntil || 0)) {
      hunter.trumpCardSelecting = false;
      return false;
    }
    const index = Number(key) - 1;
    const assistId = HUNTER_ASSIST_ORDER[index];
    if (!assistId || !HUNTER_ASSIST_SKILLS[assistId]) return false;
    if (activePatroller) activePatroller = null;
    if (activeShiftPortals) finishAssistShift(now);
    hunter.assistSkill = assistId;
    hunter.trumpCardSelecting = false;
    hunter.trumpCardSelectionUntil = 0;
    hunter.trumpCardUsed = true;
    hunter.nextAssistAt = now;
    showAssistAlert(`底牌切换 ${getHunterAssistName(assistId)}`, now, 1200);
    return true;
  }

  function isAssistRevealed(survivor, now = performance.now()) {
    return Boolean(survivor && (now < (survivor.listenRevealUntil || 0) || now < (survivor.assistRevealUntil || 0)));
  }

  function getSurvivorRoleLabel(actor) {
    return getSurvivorCharacter(actor).roleTag || "修机位";
  }

  function getSurvivorRescuePriority(actor) {
    return getSurvivorCharacter(actor).rescuePriority || 4;
  }

  function isRescueRoleSurvivor(actor) {
    return getSurvivorRoleLabel(actor) === "救人位";
  }

  function ensureBorrowedTimeForRescueRole(actor, badges) {
    const next = Array.isArray(badges) ? badges.slice() : [];
    if (!isRescueRoleSurvivor(actor) || next.includes("borrowedTime")) return next;
    const purpleLimit = BADGE_LIMITS.purple || 0;
    const purpleCount = countBadgesByRarity(PLAYER_ROLE.survivor, next, "purple");
    if (purpleCount < purpleLimit) {
      next.push("borrowedTime");
      return next;
    }
    const replaceIndex = next.findIndex((id) => getBadgeRarity(PLAYER_ROLE.survivor, id) === "purple" && id !== "borrowedTime");
    if (replaceIndex >= 0) next[replaceIndex] = "borrowedTime";
    return next;
  }

  function getHunterCharacter() {
    return HUNTER_CHARACTERS[hunter.characterId] || HUNTER_CHARACTERS.standard;
  }

  function isLanternKeeper() {
    return hunter.characterId === LANTERN_KEEPER_ID;
  }

  function isSawbone() {
    return hunter.characterId === SAWBONE_ID;
  }

  function isSoulBinder() {
    return hunter.characterId === SOUL_BINDER_ID;
  }

  function isMirrorGhost() {
    return hunter.characterId === MIRROR_GHOST_ID;
  }

  function isDancer() {
    return hunter.characterId === DANCER_ID;
  }

  function isEdictor() {
    return hunter.characterId === EDICTOR_ID;
  }

  function isAbyss() {
    return hunter.characterId === ABYSS_ID;
  }

  function isAbyssForm(now = performance.now()) {
    return isAbyss() && now < (hunter.abyssFormUntil || 0);
  }

  function isHoundMaster() {
    return hunter.characterId === HOUND_MASTER_ID;
  }

  function isHammerer() {
    return hunter.characterId === HAMMERER_ID;
  }

  function isTwinSword() {
    return hunter.characterId === TWIN_SWORD_ID;
  }

  function isTwinForm(form) {
    return isTwinSword() && hunter.twinForm === form;
  }

  function isInfiniteSawboneMode() {
    return currentMode === GAME_MODE.infiniteSawbone;
  }

  function isSoulBinderPracticeMode() {
    return currentMode === GAME_MODE.soulBinderPractice;
  }

  function isKiteSimulatorMode() {
    return currentMode === GAME_MODE.kiteSimulator;
  }

  function isKiteSimulatorNoCooldownMode() {
    return isKiteSimulatorMode() && kiteSimulatorNoCooldown;
  }

  function refreshKiteSimulatorPlayerCooldowns(now) {
    if (!isKiteSimulatorNoCooldownMode() || selectedRole !== PLAYER_ROLE.survivor) return;
    KITE_SIMULATOR_PLAYER_COOLDOWN_FIELDS.forEach((field) => {
      player[field] = now;
    });
  }

  function isPracticeTargetMode() {
    return isInfiniteSawboneMode() || isSoulBinderPracticeMode();
  }

  function hunterHasSkill() {
    return isHoundMaster() || isHammerer() || isLanternKeeper() || isSawbone() || isTwinSword() || isSoulBinder() || isMirrorGhost() || isDancer() || isEdictor() || isAbyss();
  }

  function getHoundCooldownLeft(now = performance.now()) {
    return Math.max(0, (hunter.nextHoundAt || 0) - now);
  }

  function canReleaseHound(now = performance.now()) {
    return matchStarted && isHoundMaster() && !hunter.action && !hunter.carrying && huntingHounds.length === 0 &&
      now >= hunter.stunnedUntil && now >= hunter.wipeUntil && getHoundCooldownLeft(now) <= 0;
  }

  function getNearestHoundTarget(origin = hunter, maxRange = HOUND_TARGET_RANGE) {
    return getSurvivors()
      .filter((survivor) => {
        return !survivor.escaped &&
          survivor.state !== "downed" &&
          survivor.state !== "seated" &&
          survivor.state !== "carried" &&
          survivor.state !== "eliminated" &&
          distanceBetween(origin, survivor) <= maxRange;
      })
      .sort((a, b) => distanceBetween(origin, a) - distanceBetween(origin, b))[0] || null;
  }

  function releaseHound(now = performance.now()) {
    if (!canReleaseHound(now)) return false;
    const target = getNearestHoundTarget();
    if (!target) {
      if (selectedRole === PLAYER_ROLE.hunter) showAssistAlert("600 范围内没有目标", now, 800);
      return false;
    }
    huntingHounds.push({
      kind: "huntingHound",
      x: hunter.x,
      y: hunter.y,
      radius: HOUND_RADIUS,
      angle: hunter.angle,
      target,
      until: now + HOUND_DURATION,
      leapsLeft: hunter.presenceTier >= 2 ? 1 : 0,
      path: [],
      pathGoal: null,
      repathAt: 0,
      localAvoidance: null,
      vx: 0,
      vy: 0
    });
    hunter.nextHoundAt = now + HOUND_COOLDOWN;
    trackHunterSkillUseUnlock(now);
    showAssistAlert(`放犬追踪 ${getSurvivorDisplayName(target)}`, now, 900);
    return true;
  }

  function tryHoundObstacleLeap(hound, dx, dy) {
    if (!hound || (hound.leapsLeft || 0) <= 0) return false;
    const nextX = hound.x + dx;
    const nextY = hound.y + dy;
    const candidates = [
      ...pallets.filter((pallet) => pallet.label === "dropped").map((pallet) => ({ obstacle: pallet, rect: getPalletCollisionRect(pallet) })),
      ...windows.map((windowItem) => ({ obstacle: windowItem, rect: getWindowCollisionRect(windowItem) }))
    ]
      .filter((candidate) => circleHitsRect(nextX, nextY, hound.radius + 12, candidate.rect))
      .map((candidate) => {
        const normal = getObstacleNormal(candidate.obstacle);
        const side = Math.sign((hound.x - candidate.obstacle.x) * normal.x + (hound.y - candidate.obstacle.y) * normal.y) ||
          (dx * normal.x + dy * normal.y > 0 ? -1 : 1);
        return { ...candidate, normal, side };
      })
      .filter((candidate) => (dx * candidate.normal.x + dy * candidate.normal.y) * candidate.side < -0.02)
      .sort((a, b) => distanceToProp(hound, a.obstacle) - distanceToProp(hound, b.obstacle));
    const candidate = candidates[0];
    if (!candidate) return false;
    const destination = findVaultDestination(hound, candidate.obstacle, candidate.normal, candidate.side);
    hound.x = destination.x;
    hound.y = destination.y;
    hound.leapsLeft -= 1;
    hound.path = [];
    hound.pathGoal = null;
    return true;
  }

  function resolveHoundBite(hound, target, now) {
    if (isFlywheelActive(target, now)) {
      showAssistAlert("飞轮规避猎犬", now, 650);
      return;
    }
    const blocked = tryBlockShieldBearerNegativeStatus(target, now, "猎犬撕咬");
    if (!blocked) {
      cancelSurvivorAction(target);
      target.houndStunnedUntil = Math.max(target.houndStunnedUntil || 0, now + HOUND_BITE_STUN_DURATION);
    }
    if (hunter.presenceTier >= 2) {
      hunter.nextHoundAt = Math.max(now, (hunter.nextHoundAt || now) - HOUND_TIER_TWO_REFUND);
    }
    showAssistAlert(`猎犬咬中 ${getSurvivorDisplayName(target)}`, now, 1000);
  }

  function updateHuntingHounds(dt, now) {
    for (let index = huntingHounds.length - 1; index >= 0; index -= 1) {
      const hound = huntingHounds[index];
      const target = hound.target;
      if (
        now >= hound.until ||
        !target ||
        target.escaped ||
        target.state === "downed" ||
        target.state === "seated" ||
        target.state === "carried" ||
        target.state === "eliminated"
      ) {
        huntingHounds.splice(index, 1);
        continue;
      }
      if (distanceBetween(hound, target) <= HOUND_BITE_RANGE + target.radius) {
        resolveHoundBite(hound, target, now);
        huntingHounds.splice(index, 1);
        continue;
      }
      const direction = normalizeVector(target.x - hound.x, target.y - hound.y);
      const step = HOUND_SPEED * dt;
      if (tryHoundObstacleLeap(hound, direction.x * step, direction.y * step)) continue;
      moveActorToPoint(hound, target.x, target.y, HOUND_SPEED, dt, now);
    }
  }

  function updateHammerShockEffects(now) {
    for (let index = hammerShockEffects.length - 1; index >= 0; index -= 1) {
      if (now >= hammerShockEffects[index].until) hammerShockEffects.splice(index, 1);
    }
  }

  function getHammerCooldownLeft(now = performance.now()) {
    return Math.max(0, (hunter.nextHammerShockAt || 0) - now);
  }

  function canStartHammerShock(now = performance.now()) {
    return matchStarted && isHammerer() && !hunter.action && !hunter.carrying &&
      now >= hunter.stunnedUntil && now >= hunter.wipeUntil && getHammerCooldownLeft(now) <= 0;
  }

  function startHammerShock(now = performance.now(), autoReleaseAt = 0) {
    if (!canStartHammerShock(now)) return false;
    hunter.action = {
      kind: "hammerCharge",
      start: now,
      angle: hunter.angle,
      releaseRequested: false,
      autoReleaseAt
    };
    hunter.nextHammerShockAt = now + HAMMER_COOLDOWN;
    hunter.vx = 0;
    hunter.vy = 0;
    trackHunterSkillUseUnlock(now);
    return true;
  }

  function releaseHammerShock(now = performance.now()) {
    if (!hunter.action || hunter.action.kind !== "hammerCharge") return false;
    hunter.action.releaseRequested = true;
    hunter.action.releasedAt = now;
    return true;
  }

  function getHammerChargeRatio(action, now = performance.now()) {
    return Math.max(0, Math.min(1, (now - action.start - HAMMER_MIN_CHARGE) / (HAMMER_MAX_CHARGE - HAMMER_MIN_CHARGE)));
  }

  function getHammerLeapDestination(angle, distance) {
    let x = hunter.x;
    let y = hunter.y;
    const stepSize = 6;
    const steps = Math.max(1, Math.ceil(distance / stepSize));
    const stepX = Math.cos(angle) * distance / steps;
    const stepY = Math.sin(angle) * distance / steps;
    for (let step = 0; step < steps; step += 1) {
      const nextX = x + stepX;
      const nextY = y + stepY;
      if (actorCollides(hunter, nextX, nextY, hunter.radius)) break;
      x = nextX;
      y = nextY;
    }
    return { x, y };
  }

  function beginHammerLeap(action, now) {
    const chargeRatio = getHammerChargeRatio(action, now);
    const maxDistance = hunter.presenceTier >= 2 ? HAMMER_TIER_TWO_MAX_LEAP_DISTANCE : HAMMER_MAX_LEAP_DISTANCE;
    const distance = HAMMER_MIN_LEAP_DISTANCE + (maxDistance - HAMMER_MIN_LEAP_DISTANCE) * chargeRatio;
    const destination = getHammerLeapDestination(action.angle, distance);
    hunter.action = {
      kind: "hammerLeap",
      start: now,
      until: now + HAMMER_LEAP_DURATION,
      fromX: hunter.x,
      fromY: hunter.y,
      toX: destination.x,
      toY: destination.y,
      angle: action.angle,
      chargeRatio
    };
    hunter.angle = action.angle;
  }

  function isPointInHammerImpactCone(point, range, angle) {
    const dx = point.x - hunter.x;
    const dy = point.y - hunter.y;
    if (Math.hypot(dx, dy) > range + (point.radius || 0)) return false;
    return Math.abs(angleDifference(angle, Math.atan2(dy, dx))) <= HAMMER_IMPACT_ARC / 2;
  }

  function resolveHammerImpact(action, now) {
    const maxRange = hunter.presenceTier >= 2 ? HAMMER_TIER_TWO_MAX_IMPACT_RANGE : HAMMER_MAX_IMPACT_RANGE;
    const range = HAMMER_MIN_IMPACT_RANGE + (maxRange - HAMMER_MIN_IMPACT_RANGE) * action.chargeRatio;
    let survivorHits = 0;
    getSurvivors().forEach((target) => {
      if (target.escaped || target.state !== "healthy" && target.state !== "injured") return;
      if (!isPointInHammerImpactCone(target, range, action.angle)) return;
      survivorHits += 1;
      addHunterPresenceHit(now);
      applyHunterHit(target, now, { allowTerrorShock: false, applyBoneBleed: false, damage: HAMMER_DAMAGE });
      if (hunter.presenceTier >= 1 && target.state !== "downed") {
        target.hammerVaultSlowUntil = now + HAMMER_VAULT_SLOW_DURATION;
      }
      if (target.state !== "downed") {
        cancelSurvivorAction(target);
        target.hammerVaultLockedUntil = Math.max(target.hammerVaultLockedUntil || 0, now + HAMMER_VAULT_LOCK_DURATION);
        const knockbackAngle = Math.atan2(target.y - hunter.y, target.x - hunter.x);
        moveActorSmart(target, Math.cos(knockbackAngle) * HAMMER_KNOCKBACK, Math.sin(knockbackAngle) * HAMMER_KNOCKBACK);
        target.path = [];
        target.pathGoal = null;
      }
    });
    let palletHits = 0;
    pallets.forEach((pallet) => {
      if (pallet.label !== "dropped" || !isPointInHammerImpactCone(pallet, range, action.angle)) return;
      pallet.label = "broken";
      palletHits += 1;
    });
    if (palletHits > 0) invalidateCollisionRects();
    if (hunter.presenceTier >= 2 && palletHits > 0 && survivorHits === 0) {
      hunter.nextHammerShockAt = Math.max(now, (hunter.nextHammerShockAt || now) - HAMMER_TIER_TWO_PALLET_REFUND);
    }
    hammerShockEffects.push({ x: hunter.x, y: hunter.y, angle: action.angle, range, until: now + 420 });
    hunter.wipeUntil = Math.max(hunter.wipeUntil || 0, now + HAMMER_RECOVERY);
    hunter.lastAttackHit = survivorHits > 0;
    hunter.status = survivorHits > 0 ? "wipe" : "miss";
    showAssistAlert(survivorHits > 0 ? `震荡命中 ${survivorHits}` : palletHits > 0 ? `震碎板子 ${palletHits}` : "震荡落空", now, 760);
  }

  function updateHammerAction(action, now) {
    if (action.kind === "hammerCharge") {
      hunter.status = "charging";
      hunter.vx = 0;
      hunter.vy = 0;
      const autoRelease = action.autoReleaseAt > 0 && now >= action.autoReleaseAt;
      const maxed = now - action.start >= HAMMER_MAX_CHARGE;
      const minimumReached = now - action.start >= HAMMER_MIN_CHARGE;
      if ((action.releaseRequested || autoRelease || maxed) && minimumReached) beginHammerLeap(action, now);
      return true;
    }
    if (action.kind !== "hammerLeap") return false;
    hunter.status = "hammerLeap";
    const progress = Math.max(0, Math.min(1, (now - action.start) / Math.max(1, action.until - action.start)));
    const eased = 1 - Math.pow(1 - progress, 2);
    hunter.x = action.fromX + (action.toX - action.fromX) * eased;
    hunter.y = action.fromY + (action.toY - action.fromY) * eased;
    hunter.vx = 0;
    hunter.vy = 0;
    if (now >= action.until) {
      hunter.action = null;
      resolveHammerImpact(action, now);
    }
    return true;
  }

  function getEdictViolationStacks(survivor) {
    return Math.max(0, Math.min(2, survivor && survivor.edictViolationStacks || 0));
  }

  function getDefaultEdictHookTarget() {
    return {
      x: hunter.x + Math.cos(hunter.angle) * EDICTOR_HOOK_RANGE,
      y: hunter.y + Math.sin(hunter.angle) * EDICTOR_HOOK_RANGE
    };
  }

  function startEdictHookAim(now, clientX = null, clientY = null, pointerId = null, useLastPointer = true) {
    if (edictHookAim || !canUseEdictHook(now)) return false;
    const target = getAimTargetFromPointer(clientX, clientY, useLastPointer) || getDefaultEdictHookTarget();
    edictHookAim = { targetX: target.x, targetY: target.y, pointerId };
    return true;
  }

  function updateEdictHookAim(clientX, clientY, pointerId = null) {
    if (edictHookAim && edictHookAim.pointerId !== null && pointerId !== null && edictHookAim.pointerId !== pointerId) return;
    if (typeof clientX === "number" && typeof clientY === "number") rememberAimPointer(clientX, clientY);
    if (!edictHookAim) return;
    const target = getAimTargetFromPointer(clientX, clientY);
    if (!target) return;
    edictHookAim.targetX = target.x;
    edictHookAim.targetY = target.y;
  }

  function finishEdictHookAim(now, pointerId = null) {
    if (!edictHookAim) return false;
    if (edictHookAim.pointerId !== null && pointerId !== null && edictHookAim.pointerId !== pointerId) return false;
    const aim = edictHookAim;
    edictHookAim = null;
    const dx = aim.targetX - hunter.x;
    const dy = aim.targetY - hunter.y;
    const angle = Math.hypot(dx, dy) > 8 ? Math.atan2(dy, dx) : hunter.angle;
    return useEdictHook(now, angle);
  }

  function cancelEdictHookAim(pointerId = null) {
    if (!edictHookAim) return;
    if (edictHookAim.pointerId !== null && pointerId !== null && edictHookAim.pointerId !== pointerId) return;
    edictHookAim = null;
  }

  function addEdictViolation(survivor, now) {
    if (!survivor || survivor.escaped || survivor.state === "eliminated") return;
    survivor.edictViolationStacks = Math.min(2, getEdictViolationStacks(survivor) + 1);
    survivor.edictViolationUntil = now + 60000;
  }

  function getEdictTrapCooldownLeft(now = performance.now()) {
    return Math.max(0, (hunter.nextEdictTrapAt || 0) - now);
  }

  function getEdictHookCooldownLeft(now = performance.now()) {
    return Math.max(0, (hunter.nextEdictHookAt || 0) - now);
  }

  function canPlaceEdictTrap(now) {
    return matchStarted && isEdictor() && !hunter.action && !hunter.carrying &&
      now >= hunter.stunnedUntil && now >= hunter.wipeUntil &&
      getEdictTrapCooldownLeft(now) <= 0 && edictTraps.length < EDICTOR_TRAP_LIMIT;
  }

  function placeEdictTrap(now) {
    if (!canPlaceEdictTrap(now)) return false;
    edictTraps.push({ x: hunter.x, y: hunter.y, placedAt: now });
    hunter.nextEdictTrapAt = now + EDICTOR_TRAP_COOLDOWN;
    trackHunterSkillUseUnlock(now);
    showAssistAlert(`封界 ${edictTraps.length}/${EDICTOR_TRAP_LIMIT}`, now, 800);
    return true;
  }

  function canUseEdictHook(now) {
    return matchStarted && isEdictor() && !hunter.action && !hunter.carrying &&
      now >= hunter.stunnedUntil && now >= hunter.wipeUntil &&
      getEdictHookCooldownLeft(now) <= 0;
  }

  function useEdictHook(now, angle = hunter.angle) {
    if (!canUseEdictHook(now)) return false;
    hunter.nextEdictHookAt = now + EDICTOR_HOOK_COOLDOWN;
    edictHooks.push({
      x: hunter.x + Math.cos(angle) * (hunter.radius + 12),
      y: hunter.y + Math.sin(angle) * (hunter.radius + 12),
      vx: Math.cos(angle) * EDICTOR_HOOK_SPEED,
      vy: Math.sin(angle) * EDICTOR_HOOK_SPEED,
      angle,
      traveled: 0
    });
    trackHunterSkillUseUnlock(now);
    chasePulseUntil = now + 220;
    return true;
  }

  function isAbyssActiveSurvivor(survivor) {
    return Boolean(survivor && !survivor.escaped && (survivor.state === "healthy" || survivor.state === "injured"));
  }

  function isAbyssInteractionAction(action) {
    return Boolean(action && ["repairing", "healing", "beingHealed", "rescuing", "openingGate", "vaulting", "droppingPallet"].includes(action.kind));
  }

  function getAbyssTentacleCooldownLeft(now = performance.now()) {
    return Math.max(0, (hunter.nextAbyssTentacleAt || 0) - now);
  }

  function getAbyssFormCooldownLeft(now = performance.now()) {
    return Math.max(0, (hunter.nextAbyssFormAt || 0) - now);
  }

  function getAbyssWhisperCooldownLeft(now = performance.now()) {
    return Math.max(0, (hunter.nextAbyssWhisperAt || 0) - now);
  }

  function getAbyssProjectionCooldownLeft(now = performance.now()) {
    return Math.max(0, (hunter.nextAbyssProjectionAt || 0) - now);
  }

  function getAbyssProjectionCooldown() {
    return hunter.presenceTier >= 2 ? ABYSS_PROJECTION_TIER_TWO_COOLDOWN : ABYSS_PROJECTION_COOLDOWN;
  }

  function getAbyssProjectionConfusionRange() {
    return hunter.presenceTier >= 2 ? ABYSS_PROJECTION_TIER_TWO_CONFUSION_RANGE : ABYSS_PROJECTION_CONFUSION_RANGE;
  }

  function getAbyssProjectionConfusionDuration() {
    return hunter.presenceTier >= 2 ? ABYSS_PROJECTION_TIER_TWO_CONFUSION_DURATION : ABYSS_PROJECTION_CONFUSION_DURATION;
  }

  function canUseAbyssTentacle(now = performance.now()) {
    return matchStarted && isAbyss() && !hunter.action && !hunter.carrying &&
      now >= hunter.stunnedUntil && now >= hunter.wipeUntil && getAbyssTentacleCooldownLeft(now) <= 0;
  }

  function getDefaultAbyssTentacleTarget() {
    return {
      x: hunter.x + Math.cos(hunter.angle) * ABYSS_TENTACLE_RANGE,
      y: hunter.y + Math.sin(hunter.angle) * ABYSS_TENTACLE_RANGE
    };
  }

  function startAbyssTentacleAim(now, clientX = null, clientY = null, pointerId = null, useLastPointer = true) {
    if (abyssTentacleAim || !canUseAbyssTentacle(now)) return false;
    const target = getAimTargetFromPointer(clientX, clientY, useLastPointer) || getDefaultAbyssTentacleTarget();
    abyssTentacleAim = { targetX: target.x, targetY: target.y, pointerId };
    return true;
  }

  function updateAbyssTentacleAim(clientX, clientY, pointerId = null) {
    if (!abyssTentacleAim || abyssTentacleAim.pointerId !== null && pointerId !== null && abyssTentacleAim.pointerId !== pointerId) return;
    if (typeof clientX === "number" && typeof clientY === "number") rememberAimPointer(clientX, clientY);
    const target = getAimTargetFromPointer(clientX, clientY);
    if (!target) return;
    abyssTentacleAim.targetX = target.x;
    abyssTentacleAim.targetY = target.y;
  }

  function finishAbyssTentacleAim(now, pointerId = null) {
    if (!abyssTentacleAim || abyssTentacleAim.pointerId !== null && pointerId !== null && abyssTentacleAim.pointerId !== pointerId) return false;
    const aim = abyssTentacleAim;
    abyssTentacleAim = null;
    return useAbyssTentacle(now, aim.targetX, aim.targetY);
  }

  function cancelAbyssTentacleAim(pointerId = null) {
    if (!abyssTentacleAim || abyssTentacleAim.pointerId !== null && pointerId !== null && abyssTentacleAim.pointerId !== pointerId) return;
    abyssTentacleAim = null;
  }

  function getAbyssTentaclePlacement(targetX, targetY) {
    const dx = targetX - hunter.x;
    const dy = targetY - hunter.y;
    const distance = Math.hypot(dx, dy);
    const angle = distance > 8 ? Math.atan2(dy, dx) : hunter.angle;
    let placementDistance = Math.min(ABYSS_TENTACLE_RANGE, distance || ABYSS_TENTACLE_RANGE);
    for (let step = hunter.radius + 10; step <= placementDistance; step += 12) {
      if (!collides(hunter.x + Math.cos(angle) * step, hunter.y + Math.sin(angle) * step, 12)) continue;
      placementDistance = Math.max(hunter.radius + 10, step - 12);
      break;
    }
    return {
      x: hunter.x + Math.cos(angle) * placementDistance,
      y: hunter.y + Math.sin(angle) * placementDistance,
      angle
    };
  }

  function useAbyssTentacle(now, targetX = null, targetY = null) {
    if (!canUseAbyssTentacle(now)) return false;
    const target = targetX === null || targetY === null ? getDefaultAbyssTentacleTarget() : { x: targetX, y: targetY };
    const placement = getAbyssTentaclePlacement(target.x, target.y);
    const startX = hunter.x + Math.cos(placement.angle) * (hunter.radius + 10);
    const startY = hunter.y + Math.sin(placement.angle) * (hunter.radius + 10);
    const travelDuration = Math.max(80, Math.round(Math.hypot(placement.x - startX, placement.y - startY) / ABYSS_TENTACLE_SPEED * 1000));
    hunter.nextAbyssTentacleAt = now + ABYSS_TENTACLE_COOLDOWN;
    abyssTentacles.push({
      ...placement,
      x: startX,
      y: startY,
      startX,
      startY,
      landingX: placement.x,
      landingY: placement.y,
      phase: "travel",
      travelStartedAt: now,
      arriveAt: now + travelDuration,
      strikeAt: 0,
      expiresAt: 0
    });
    trackHunterSkillUseUnlock(now);
    return true;
  }

  function resolveAbyssTentacleStrike(tentacle, now) {
    const target = getSurvivors()
      .filter((survivor) => {
        if (!isAbyssActiveSurvivor(survivor) || !hasWalkableLine(tentacle.x, tentacle.y, survivor.x, survivor.y, survivor.radius)) return false;
        const distance = distanceBetween(survivor, tentacle);
        if (distance > ABYSS_TENTACLE_STRIKE_RANGE + survivor.radius * 0.5) return false;
        if (distance <= survivor.radius * 0.5) return true;
        const targetAngle = Math.atan2(survivor.y - tentacle.y, survivor.x - tentacle.x);
        return Math.abs(angleDifference(tentacle.angle, targetAngle)) <= ABYSS_TENTACLE_STRIKE_ARC * 0.5;
      })
      .sort((a, b) => distanceBetween(a, tentacle) - distanceBetween(b, tentacle))[0];
    if (!target) {
      showAssistAlert("触须拍击落空", now, 650);
      return;
    }
    const interrupted = isAbyssInteractionAction(target.action);
    addHunterPresenceHit(now);
    applyHunterHit(target, now, { allowTerrorShock: false, applyBoneBleed: false, damage: ABYSS_TENTACLE_DAMAGE });
    if (interrupted && target.state !== "downed") {
      target.abyssStaggerUntil = Math.max(target.abyssStaggerUntil || 0, now + ABYSS_TENTACLE_STAGGER);
    }
    showAssistAlert(interrupted ? `触须中断 ${getSurvivorDisplayName(target)}` : `触须命中 ${getSurvivorDisplayName(target)}`, now, 900);
  }

  function updateAbyssTentacles(dt, now) {
    for (let index = abyssTentacles.length - 1; index >= 0; index -= 1) {
      const tentacle = abyssTentacles[index];
      if (tentacle.phase === "travel") {
        const duration = Math.max(1, tentacle.arriveAt - tentacle.travelStartedAt);
        const progress = Math.max(0, Math.min(1, (now - tentacle.travelStartedAt) / duration));
        tentacle.x = tentacle.startX + (tentacle.landingX - tentacle.startX) * progress;
        tentacle.y = tentacle.startY + (tentacle.landingY - tentacle.startY) * progress;
        if (progress >= 1) {
          tentacle.phase = "telegraph";
          tentacle.strikeAt = now + ABYSS_TENTACLE_DELAY;
        }
        continue;
      }
      if (tentacle.phase === "telegraph") {
        if (now >= tentacle.strikeAt) {
          resolveAbyssTentacleStrike(tentacle, now);
          tentacle.phase = "sweep";
          tentacle.expiresAt = now + ABYSS_TENTACLE_SWEEP_DURATION;
        }
        continue;
      }
      if (tentacle.phase === "sweep" && now >= tentacle.expiresAt) abyssTentacles.splice(index, 1);
    }
  }

  function canStartAbyssForm(now = performance.now()) {
    return matchStarted && isAbyss() && !isAbyssForm(now) && !hunter.action && !hunter.carrying &&
      now >= hunter.stunnedUntil && now >= hunter.wipeUntil && (hunter.abyssValue || 0) >= ABYSS_FORM_COST && getAbyssFormCooldownLeft(now) <= 0;
  }

  function startAbyssForm(now = performance.now()) {
    if (!canStartAbyssForm(now)) return false;
    hunter.abyssValue = Math.max(0, (hunter.abyssValue || 0) - ABYSS_FORM_COST);
    hunter.abyssFormUntil = now + ABYSS_FORM_DURATION;
    refreshAbyssFormAttackRange(now);
    showAssistAlert("沉没 · 诡异形态", now, 950);
    return true;
  }

  function endAbyssForm(now = performance.now(), showAlert = true) {
    if (!isAbyssForm(now) && !(hunter.abyssFormUntil || 0)) return false;
    hunter.abyssFormUntil = 0;
    hunter.nextAbyssFormAt = Math.max(hunter.nextAbyssFormAt || 0, now + ABYSS_FORM_COOLDOWN);
    refreshAbyssFormAttackRange(now);
    if (showAlert) showAssistAlert("沉没结束", now, 700);
    return true;
  }

  function refreshAbyssFormAttackRange(now = performance.now()) {
    const base = hunter.baseAttackRange || hunter.attackRange;
    hunter.attackRange = isAbyssForm(now) && hunter.presenceTier >= 2 ? base * 1.2 : base;
  }

  function triggerAbyssFormDownReset(now) {
    if (!isAbyssForm(now) || hunter.presenceTier < 2) return;
    hunter.abyssFormUntil = now + ABYSS_FORM_DURATION;
    showAssistAlert("沉没延续 · 25秒", now, 800);
  }

  function canUseAbyssWhisper(now = performance.now()) {
    return matchStarted && isAbyss() && !isAbyssForm(now) && hunter.presenceTier >= 1 && !hunter.action && !hunter.carrying &&
      now >= hunter.stunnedUntil && now >= hunter.wipeUntil && getAbyssWhisperCooldownLeft(now) <= 0;
  }

  function useAbyssWhisper(now = performance.now()) {
    if (!canUseAbyssWhisper(now)) return false;
    hunter.nextAbyssWhisperAt = now + ABYSS_WHISPER_COOLDOWN;
    let affected = 0;
    getSurvivors().forEach((survivor) => {
      if (!isAbyssActiveSurvivor(survivor) || distanceBetween(survivor, hunter) > ABYSS_WHISPER_RANGE) return;
      if (tryBlockShieldBearerNegativeStatus(survivor, now, "深渊低语")) return;
      survivor.abyssWhisperUntil = Math.max(survivor.abyssWhisperUntil || 0, now + ABYSS_WHISPER_DURATION);
      affected += 1;
    });
    trackHunterSkillUseUnlock(now);
    showAssistAlert(affected > 0 ? `深渊低语 · ${affected}人受扰` : "深渊低语落空", now, 900);
    return true;
  }

  function canUseAbyssProjection(now = performance.now()) {
    return matchStarted && isAbyssForm(now) && !hunter.action && !hunter.carrying &&
      now >= hunter.stunnedUntil && now >= hunter.wipeUntil && getAbyssProjectionCooldownLeft(now) <= 0;
  }

  function useAbyssProjection(now = performance.now()) {
    if (!canUseAbyssProjection(now)) return false;
    abyssProjections.push({
      kind: "abyssProjection",
      x: hunter.x,
      y: hunter.y,
      radius: hunter.radius,
      angle: hunter.angle,
      until: now + ABYSS_PROJECTION_DURATION,
      path: [],
      pathGoal: null,
      repathAt: 0,
      vx: 0,
      vy: 0,
      nextAttackAt: now,
      attackUntil: 0,
      wipeUntil: 0,
      palletStunnedUntil: 0
    });
    hunter.nextAbyssProjectionAt = now + getAbyssProjectionCooldown();
    trackHunterSkillUseUnlock(now);
    showAssistAlert("深渊投影", now, 800);
    return true;
  }

  function applyAbyssProjectionConfusion(projection, now) {
    const range = getAbyssProjectionConfusionRange();
    const duration = getAbyssProjectionConfusionDuration();
    getSurvivors().forEach((survivor) => {
      if (!isAbyssActiveSurvivor(survivor) || distanceBetween(survivor, projection) > range) return;
      if (tryBlockShieldBearerNegativeStatus(survivor, now, "方向紊乱")) return;
      survivor.abyssConfusedUntil = Math.max(survivor.abyssConfusedUntil || 0, now + duration);
    });
  }

  function updateAbyssProjections(dt, now) {
    for (let index = abyssProjections.length - 1; index >= 0; index -= 1) {
      const projection = abyssProjections[index];
      if (now >= projection.until) {
        applyAbyssProjectionConfusion(projection, now);
        abyssProjections.splice(index, 1);
        continue;
      }
      if (now < (projection.palletStunnedUntil || 0)) {
        projection.vx = 0;
        projection.vy = 0;
        continue;
      }
      if (now < (projection.wipeUntil || 0)) {
        projection.vx = 0;
        projection.vy = 0;
        continue;
      }
      const target = getSurvivors()
        .filter(isAbyssActiveSurvivor)
        .sort((a, b) => distanceBetween(a, projection) - distanceBetween(b, projection))[0];
      if (!target) continue;
      projection.angle = Math.atan2(target.y - projection.y, target.x - projection.x);
      if (!tryAbyssProjectionAttack(projection, target, now)) {
        moveActorToPoint(projection, target.x, target.y, ABYSS_PROJECTION_SPEED, dt, now);
      }
    }
  }

  function tryAbyssProjectionAttack(projection, target, now) {
    if (now < (projection.nextAttackAt || 0)) return false;
    const distance = distanceBetween(projection, target);
    const range = (hunter.baseAttackRange || hunter.attackRange) + target.radius * 0.5;
    if (distance > range || !hasWalkableLine(projection.x, projection.y, target.x, target.y, projection.radius)) return false;
    projection.angle = Math.atan2(target.y - projection.y, target.x - projection.x);
    projection.nextAttackAt = now + ABYSS_PROJECTION_ATTACK_COOLDOWN;
    projection.attackUntil = now + ABYSS_PROJECTION_ATTACK_WINDUP;
    projection.wipeUntil = now + getHunterHitRecoveryDuration();
    addHunterPresenceHit(now);
    applyHunterHit(target, now, {
      allowTerrorShock: false,
      applyBoneBleed: false,
      basicAttack: true,
      damage: ABYSS_PROJECTION_ATTACK_DAMAGE
    });
    return true;
  }

  function isAbyssGazeTarget(survivor) {
    if (!isAbyssActiveSurvivor(survivor) || isSurvivorInvisible(survivor)) return false;
    if (distanceBetween(survivor, hunter) > ABYSS_GAZE_RANGE) return false;
    const angle = Math.atan2(survivor.y - hunter.y, survivor.x - hunter.x);
    return Math.abs(angleDifference(hunter.angle, angle)) <= ABYSS_GAZE_ARC * 0.5 && hasWalkableLine(hunter.x, hunter.y, survivor.x, survivor.y, survivor.radius);
  }

  function updateAbyssGaze(dt) {
    const target = getSurvivors().filter(isAbyssGazeTarget).sort((a, b) => distanceBetween(a, hunter) - distanceBetween(b, hunter))[0];
    if (!target) {
      hunter.abyssGazeProgress = Math.max(0, (hunter.abyssGazeProgress || 0) * Math.pow(1 - ABYSS_GAZE_PROGRESS_DECAY_PER_SECOND, Math.max(0, dt)));
      return;
    }
    hunter.abyssGazeProgress = (hunter.abyssGazeProgress || 0) + dt * 1000;
    while (hunter.abyssGazeProgress >= ABYSS_GAZE_INTERVAL && (hunter.abyssValue || 0) < ABYSS_VALUE_MAX) {
      hunter.abyssGazeProgress -= ABYSS_GAZE_INTERVAL;
      hunter.abyssValue += 1;
    }
  }

  function updateAbyssSense(now) {
    const senses = getSurvivors()
      .filter((survivor) => isAbyssActiveSurvivor(survivor) && distanceBetween(survivor, hunter) <= ABYSS_SENSE_RANGE && (survivor.state === "injured" || isAbyssInteractionAction(survivor.action)))
      .map((survivor) => ({ survivor, until: now + ABYSS_SENSE_DURATION }));
    hunter.abyssSenseTargets = senses;
  }

  function updateAbyssSystems(dt, now) {
    if (!isAbyss()) return;
    if (hunter.abyssFormUntil && now >= hunter.abyssFormUntil) endAbyssForm(now);
    refreshAbyssFormAttackRange(now);
    updateAbyssGaze(dt);
    updateAbyssSense(now);
  }

  function getSegmentNormal(segment) {
    const dx = segment.x2 - segment.x1;
    const dy = segment.y2 - segment.y1;
    const length = Math.hypot(dx, dy);
    if (length < 0.001) return { x: 0, y: -1 };
    return { x: -dy / length, y: dx / length };
  }

  function createMirrorRiftAt(actor, now = performance.now()) {
    if (!isMirrorGhost() || !actor) return;
    const safe = findNearestSafePosition(actor.x, actor.y, Math.max(12, (actor.radius || 22) * 0.65));
    pushMirrorRift(safe.x, safe.y, now);
    chasePulseUntil = now + 260;
  }

  function createMirrorRiftNearSurvivor(survivor, now = performance.now()) {
    if (!isMirrorGhost() || !survivor) return false;
    const angle = Math.random() * Math.PI * 2;
    const distance = 36 + Math.random() * MIRROR_RIFT_NO_HEARTBEAT_SPAWN_RADIUS;
    const safe = findNearestSafePosition(
      survivor.x + Math.cos(angle) * distance,
      survivor.y + Math.sin(angle) * distance,
      Math.max(12, survivor.radius * 0.65)
    );
    pushMirrorRift(safe.x, safe.y, now);
    chasePulseUntil = now + 260;
    return true;
  }

  function pushMirrorRift(x, y, now = performance.now()) {
    mirrorRifts.push({ id: ++mirrorRiftId, x, y, createdAt: now });
    while (mirrorRifts.length > MIRROR_RIFT_MAX) mirrorRifts.shift();
  }

  function updateMirrorNoHeartbeatRifts(now) {
    if (!isMirrorGhost()) return;
    getSurvivors().forEach((survivor) => {
      if (survivor.escaped || survivor.state === "eliminated" || survivor.state === "seated" || survivor.state === "carried") {
        survivor.mirrorNoHeartbeatSince = now;
        return;
      }
      if (isSurvivorInHeartbeat(survivor)) {
        survivor.mirrorNoHeartbeatSince = now;
        return;
      }
      if (!survivor.mirrorNoHeartbeatSince) survivor.mirrorNoHeartbeatSince = now;
      if (now - survivor.mirrorNoHeartbeatSince < MIRROR_RIFT_NO_HEARTBEAT_DELAY) return;
      if (createMirrorRiftNearSurvivor(survivor, now)) survivor.mirrorNoHeartbeatSince = now;
    });
  }

  function updateMirrorRifts(now) {
    if (mirrorRifts.length === 0) return;
    if (mirrorRifts.length >= 2) {
      getSurvivors().forEach((survivor) => {
        if (survivor.escaped || survivor.state === "eliminated" || survivor.state === "seated" || survivor.state === "carried") return;
        maybeTeleportActorThroughMirrorRift(survivor, now);
      });
    }
    if (!hunter.carrying) maybeTeleportActorThroughMirrorRift(hunter, now);
  }

  function maybeTeleportActorThroughMirrorRift(actor, now, forcedSource = null, ignoreCooldown = false) {
    if (!actor || !ignoreCooldown && now < (actor.mirrorTeleportReadyAt || 0)) return false;
    if (actor !== hunter && actor.state === "downed") return false;
    const source = forcedSource || getMirrorRiftSourceForActor(actor);
    if (!source) return false;
    const target = getMirrorRiftExitForActor(actor, source);
    if (!target && forcedSource) {
      const angle = Math.random() * Math.PI * 2;
      const offset = (actor.radius || 20) + 18;
      return teleportActorToMirrorPoint(actor, {
        x: forcedSource.x + Math.cos(angle) * offset,
        y: forcedSource.y + Math.sin(angle) * offset
      }, now);
    }
    if (!target) return false;
    return teleportActorToMirrorPoint(actor, target, now);
  }

  function getMirrorRiftSourceForActor(actor) {
    if (!actor) return null;
    return mirrorRifts.find((rift) => distanceBetween(actor, rift) <= MIRROR_RIFT_TRIGGER_RADIUS + (actor.radius || 0) * 0.25) || null;
  }

  function teleportActorToMirrorPoint(actor, target, now) {
    const safe = findNearestSafePosition(target.x, target.y, actor.radius || 20);
    actor.x = safe.x;
    actor.y = safe.y;
    actor.vx = 0;
    actor.vy = 0;
    actor.path = [];
    actor.pathGoal = null;
    actor.repathAt = 0;
    actor.mirrorTeleportReadyAt = now + getMirrorTeleportCooldownForActor(actor);
    if (actor === hunter) updateCarriedSurvivorPosition();
    showAssistAlert(actor === hunter ? "镜鬼穿隙" : "空间裂缝", now, 760);
    chasePulseUntil = now + 300;
    return true;
  }

  function getMirrorRiftExitForActor(actor, source) {
    if (actor && actor !== hunter) return getNearestMirrorRiftExitToHunter(source);
    if (actor === hunter && isMirrorGhost()) return getNearestMirrorRiftExitToSurvivors(source) || getRandomMirrorRiftExit(source);
    return getRandomMirrorRiftExit(source);
  }

  function getNearestMirrorRiftExitToHunter(source) {
    const targets = mirrorRifts.filter((rift) => rift !== source);
    if (targets.length === 0) return null;
    const target = targets.reduce((best, rift) => distanceBetween(hunter, rift) < distanceBetween(hunter, best) ? rift : best, targets[0]);
    const away = normalizeVector(target.x - hunter.x, target.y - hunter.y);
    const fallbackAngle = Math.random() * Math.PI * 2;
    const x = away.x || Math.cos(fallbackAngle);
    const y = away.y || Math.sin(fallbackAngle);
    return {
      x: target.x + x * (MIRROR_RIFT_RADIUS + 32),
      y: target.y + y * (MIRROR_RIFT_RADIUS + 32)
    };
  }

  function getNearestMirrorRiftExitToSurvivors(source) {
    const targets = mirrorRifts.filter((rift) => rift !== source);
    const survivors = getSurvivors().filter((survivor) =>
      !survivor.escaped &&
      survivor.state !== "eliminated" &&
      survivor.state !== "carried" &&
      survivor.state !== "seated"
    );
    if (targets.length === 0 || survivors.length === 0) return null;
    let bestTarget = null;
    let bestSurvivor = null;
    let bestDistance = Infinity;
    targets.forEach((rift) => {
      survivors.forEach((survivor) => {
        const distance = distanceBetween(rift, survivor);
        if (distance < bestDistance) {
          bestTarget = rift;
          bestSurvivor = survivor;
          bestDistance = distance;
        }
      });
    });
    if (!bestTarget) return null;
    const towardSurvivor = normalizeVector(bestSurvivor.x - bestTarget.x, bestSurvivor.y - bestTarget.y);
    const fallbackAngle = Math.random() * Math.PI * 2;
    const x = towardSurvivor.x || Math.cos(fallbackAngle);
    const y = towardSurvivor.y || Math.sin(fallbackAngle);
    return {
      x: bestTarget.x + x * (MIRROR_RIFT_RADIUS + hunter.radius + 18),
      y: bestTarget.y + y * (MIRROR_RIFT_RADIUS + hunter.radius + 18)
    };
  }

  function getRandomMirrorRiftExit(source) {
    const targets = mirrorRifts.filter((rift) => rift !== source);
    if (targets.length === 0) return null;
    const target = targets[Math.floor(Math.random() * targets.length)];
    const angle = Math.random() * Math.PI * 2;
    return {
      x: target.x + Math.cos(angle) * (MIRROR_RIFT_RADIUS + 32),
      y: target.y + Math.sin(angle) * (MIRROR_RIFT_RADIUS + 32)
    };
  }

  function getRandomMirrorCurtainPoint() {
    if (mirrorCurtains.length === 0) return null;
    const curtain = mirrorCurtains[Math.floor(Math.random() * mirrorCurtains.length)];
    const t = 0.2 + Math.random() * 0.6;
    const x = curtain.x1 + (curtain.x2 - curtain.x1) * t;
    const y = curtain.y1 + (curtain.y2 - curtain.y1) * t;
    const normal = getSegmentNormal(curtain);
    const side = Math.random() < 0.5 ? -1 : 1;
    return {
      x: x + normal.x * side * (MIRROR_CURTAIN_THICKNESS + hunter.radius + 14),
      y: y + normal.y * side * (MIRROR_CURTAIN_THICKNESS + hunter.radius + 14)
    };
  }

  function getMirrorCurtainCooldownLeft(now) {
    return Math.max(0, (hunter.nextMirrorCurtainAt || 0) - now);
  }

  function canStartMirrorCurtainAim(now) {
    return matchStarted &&
      selectedRole === PLAYER_ROLE.hunter &&
      isMirrorGhost() &&
      !hunter.action &&
      !hunter.carrying &&
      now >= hunter.stunnedUntil &&
      now >= hunter.wipeUntil &&
      getMirrorCurtainCooldownLeft(now) <= 0;
  }

  function startMirrorCurtainAim(now) {
    if (mirrorCurtainAim) {
      mirrorCurtainAim = null;
      showAssistAlert("取消镜幕", now, 600);
      return false;
    }
    if (!canStartMirrorCurtainAim(now)) {
      showAssistAlert(getMirrorCurtainBlockedReason(now), now, 900);
      return false;
    }
    mirrorCurtainAim = { start: null, current: null, startedAt: now, pointerId: null };
    showAssistAlert("划线放置镜幕", now, 1000);
    return true;
  }

  function getMirrorCurtainBlockedReason(now) {
    if (!matchStarted || selectedRole !== PLAYER_ROLE.hunter || !isMirrorGhost()) return "镜幕不可用";
    if (hunter.action || hunter.carrying || now < hunter.stunnedUntil || now < hunter.wipeUntil) return "正在行动";
    const cooldown = getMirrorCurtainCooldownLeft(now);
    return cooldown > 0 ? `镜幕冷却${formatCooldown(cooldown)}` : "镜幕不可用";
  }

  function beginMirrorCurtainLine(clientX, clientY, pointerId = null) {
    if (!mirrorCurtainAim) return false;
    const point = getAimTargetFromPointer(clientX, clientY, false);
    if (!point) return false;
    mirrorCurtainAim.start = point;
    mirrorCurtainAim.current = point;
    mirrorCurtainAim.pointerId = pointerId;
    return true;
  }

  function updateMirrorCurtainAim(clientX, clientY, pointerId = null) {
    if (!mirrorCurtainAim) return false;
    if (mirrorCurtainAim.pointerId !== null && pointerId !== mirrorCurtainAim.pointerId) return false;
    if (!mirrorCurtainAim.start) return false;
    const point = getAimTargetFromPointer(clientX, clientY, false);
    if (!point) return false;
    mirrorCurtainAim.current = clampMirrorCurtainEnd(mirrorCurtainAim.start, point);
    return true;
  }

  function finishMirrorCurtainAim(now, pointerId = null) {
    if (!mirrorCurtainAim) return false;
    if (mirrorCurtainAim.pointerId !== null && pointerId !== mirrorCurtainAim.pointerId) return false;
    const aim = mirrorCurtainAim;
    mirrorCurtainAim = null;
    if (!aim.start || !aim.current || distanceBetween(aim.start, aim.current) < MIRROR_CURTAIN_MIN_LENGTH) {
      showAssistAlert("镜幕太短", now, 700);
      return false;
    }
    placeMirrorCurtain(aim.start, aim.current, now);
    return true;
  }

  function clampMirrorCurtainEnd(start, point) {
    const dx = point.x - start.x;
    const dy = point.y - start.y;
    const length = Math.hypot(dx, dy);
    if (length < MIRROR_CURTAIN_MIN_LENGTH) return point;
    const clamped = Math.min(MIRROR_CURTAIN_MAX_LENGTH, length);
    return { x: start.x + (dx / length) * clamped, y: start.y + (dy / length) * clamped };
  }

  function placeMirrorCurtain(start, end, now) {
    mirrorCurtains.push({ id: ++mirrorCurtainId, x1: start.x, y1: start.y, x2: end.x, y2: end.y, createdAt: now, until: now + MIRROR_CURTAIN_DURATION });
    hunter.nextMirrorCurtainAt = now + MIRROR_CURTAIN_COOLDOWN;
    showAssistAlert("镜幕展开", now, 900);
  }

  function updateMirrorCurtains(now) {
    for (let index = mirrorCurtains.length - 1; index >= 0; index -= 1) {
      if (now >= (mirrorCurtains[index].until || 0)) mirrorCurtains.splice(index, 1);
    }
  }

  function getDanceStepCooldownLeft(now) {
    return Math.max(0, (hunter.nextDanceStepAt || 0) - now);
  }

  function isInfiniteDanceActive(now = performance.now()) {
    return isDancer() && hunter.presenceTier >= 2 && now < (hunter.infiniteDanceUntil || 0);
  }

  function getDanceStepCooldown(now = performance.now()) {
    return isInfiniteDanceActive(now) ? INFINITE_DANCE_STEP_COOLDOWN : 7000;
  }

  function getDanceSpinCooldown(now = performance.now()) {
    return isInfiniteDanceActive(now) ? INFINITE_DANCE_SPIN_COOLDOWN : DANCE_SPIN_COOLDOWN;
  }

  function canStartDanceStep(now) {
    return matchStarted &&
      isDancer() &&
      !hunter.action &&
      !hunter.carrying &&
      now >= hunter.stunnedUntil &&
      now >= hunter.wipeUntil &&
      getDanceStepCooldownLeft(now) <= 0;
  }

  function startDanceStep(targetX, targetY, now) {
    if (!canStartDanceStep(now)) return false;
    const dx = targetX - hunter.x;
    const dy = targetY - hunter.y;
    const distance = Math.hypot(dx, dy);
    const facing = distance > 8 ? Math.atan2(dy, dx) : hunter.angle || 0;
    hunter.action = {
      kind: "danceStep",
      start: now,
      until: now + DANCE_STEP_WINDUP,
      angle: facing,
      fromX: hunter.x,
      fromY: hunter.y,
      pointX: hunter.x + Math.cos(facing) * Math.min(DANCE_POINT_CAST_RANGE, Math.max(80, distance || DANCE_POINT_CAST_RANGE)),
      pointY: hunter.y + Math.sin(facing) * Math.min(DANCE_POINT_CAST_RANGE, Math.max(80, distance || DANCE_POINT_CAST_RANGE))
    };
    hunter.status = "dancing";
    hunter.nextDanceStepAt = now + getDanceStepCooldown(now);
    showAssistAlert("舞步起势", now, 650);
    return true;
  }

  function startDancePointAim(now, clientX = null, clientY = null, pointerId = null, useLastPointer = true) {
    if (dancePointAim) return true;
    if (!canStartDanceStep(now)) return false;
    const target = getAimTargetFromPointer(clientX, clientY, useLastPointer) || {
      x: hunter.x + Math.cos(hunter.angle) * DANCE_POINT_CAST_RANGE,
      y: hunter.y + Math.sin(hunter.angle) * DANCE_POINT_CAST_RANGE
    };
    dancePointAim = { targetX: target.x, targetY: target.y, pointerId };
    showAssistAlert("拖拽放置舞点", now, 900);
    return true;
  }

  function updateDancePointAim(clientX, clientY, pointerId = null) {
    if (!dancePointAim) return;
    if (dancePointAim.pointerId !== null && pointerId !== null && dancePointAim.pointerId !== pointerId) return;
    const target = getAimTargetFromPointer(clientX, clientY);
    if (!target) return;
    dancePointAim.targetX = target.x;
    dancePointAim.targetY = target.y;
  }

  function finishDancePointAim(now, pointerId = null) {
    if (!dancePointAim) return false;
    if (dancePointAim.pointerId !== null && pointerId !== null && dancePointAim.pointerId !== pointerId) return false;
    const aim = dancePointAim;
    dancePointAim = null;
    return startDanceStep(aim.targetX, aim.targetY, now);
  }

  function getDancePointPlacement(action) {
    return getDancePointPlacementFromTarget(action.pointX, action.pointY, action.fromX, action.fromY);
  }

  function getDancePointPlacementFromTarget(targetX, targetY, originX = hunter.x, originY = hunter.y) {
    const dx = targetX - originX;
    const dy = targetY - originY;
    const distance = Math.hypot(dx, dy);
    const angle = distance > 8 ? Math.atan2(dy, dx) : hunter.angle;
    const reach = Math.min(DANCE_POINT_CAST_RANGE, Math.max(80, distance || DANCE_POINT_CAST_RANGE));
    return findNearestSafePosition(originX + Math.cos(angle) * reach, originY + Math.sin(angle) * reach, 10);
  }

  function finishDanceStep(action, now) {
    const beforeX = hunter.x;
    const beforeY = hunter.y;
    moveActorSmart(hunter, Math.cos(action.angle) * DANCE_STEP_DISTANCE, Math.sin(action.angle) * DANCE_STEP_DISTANCE);
    hunter.angle = action.angle;
    const pointPosition = getDancePointPlacement(action);
    const point = { x: pointPosition.x, y: pointPosition.y, createdAt: now, until: now + DANCE_POINT_DURATION };
    hunter.action = null;
    hunter.vx = 0;
    hunter.vy = 0;
    if (!pendingDancePoint || now >= pendingDancePoint.until) {
      pendingDancePoint = point;
      hunter.status = "chasing";
      showAssistAlert("舞点落下", now, 850);
      if (beforeX === hunter.x && beforeY === hunter.y) hunter.path = [];
      return;
    }
    pendingDanceLine = {
      firstPoint: pendingDancePoint,
      secondPoint: point,
      connectAt: now + DANCE_LINE_CONNECT_DELAY
    };
    pendingDancePoint = null;
    hunter.status = "chasing";
    showAssistAlert("舞点共鸣", now, DANCE_LINE_CONNECT_DELAY);
    if (beforeX === hunter.x && beforeY === hunter.y) hunter.path = [];
  }

  function createDanceLine(firstPoint, secondPoint, now) {
    const line = {
      id: ++danceLineId,
      x1: firstPoint.x,
      y1: firstPoint.y,
      x2: secondPoint.x,
      y2: secondPoint.y,
      createdAt: now,
      until: now + DANCE_LINE_DURATION,
      marked: new Set()
    };
    danceLines.push(line);
    let hitCount = 0;
    getSurvivors().forEach((survivor) => {
      if (survivor.escaped || survivor.state === "downed" || survivor.state === "eliminated" || survivor.state === "seated" || survivor.state === "carried") return;
      if (!circleHitsSegment(survivor.x, survivor.y, survivor.radius + DANCE_LINE_THICKNESS * 0.5, line)) return;
      line.marked.add(survivor);
      if (isFlywheelActive(survivor, now)) {
        showAssistAlert("飞轮规避舞线", now, 650);
        return;
      }
      addHunterPresenceHit(now);
      applyHunterHit(survivor, now, { damage: 1, allowTerrorShock: false, danceLine: true });
      hitCount += 1;
    });
    if (hitCount === 0) {
      hunter.lastAttackHit = false;
      hunter.status = "chasing";
      showAssistAlert("舞线展开", now, 850);
    } else {
      hunter.status = "chasing";
      showAssistAlert(`舞线命中 ${hitCount}人`, now, 850);
    }
  }

  function updateDanceStepAction(action, now) {
    hunter.status = "dancing";
    hunter.angle = action.angle;
    hunter.vx = 0;
    hunter.vy = 0;
    if (now >= action.until) finishDanceStep(action, now);
    return true;
  }

  function updateDanceLines(now) {
    if (pendingDancePoint && now >= pendingDancePoint.until) pendingDancePoint = null;
    if (pendingDanceLine && now >= pendingDanceLine.connectAt) {
      const { firstPoint, secondPoint } = pendingDanceLine;
      pendingDanceLine = null;
      createDanceLine(firstPoint, secondPoint, now);
    }
    for (let index = danceLines.length - 1; index >= 0; index -= 1) {
      const line = danceLines[index];
      if (now >= line.until) {
        danceLines.splice(index, 1);
        continue;
      }
      getSurvivors().forEach((survivor) => {
        if (line.marked.has(survivor) || survivor.escaped || survivor.state === "downed" || survivor.state === "eliminated" || survivor.state === "seated" || survivor.state === "carried") return;
        if (!circleHitsSegment(survivor.x, survivor.y, survivor.radius + DANCE_LINE_THICKNESS * 0.5, line)) return;
        line.marked.add(survivor);
        if (isFlywheelActive(survivor, now)) {
          showAssistAlert("飞轮规避舞线", now, 650);
          return;
        }
        if (addDanceErosion(survivor, 1) > 0) showAssistAlert(`侵蚀 ${getDanceErosionStacks(survivor)}层`, now, 700);
      });
    }
  }

  function canUseDanceSpin(now) {
    return matchStarted &&
      isDancer() &&
      hunter.presenceTier >= 1 &&
      !hunter.action &&
      !hunter.carrying &&
      now >= hunter.stunnedUntil &&
      now >= hunter.wipeUntil &&
      now >= (hunter.nextDanceSpinAt || 0) &&
      danceLines.length > 0;
  }

  function useDanceSpin(now) {
    if (!canUseDanceSpin(now)) return false;
    const line = danceLines
      .slice()
      .sort((a, b) => distanceToSegment(hunter.x, hunter.y, a.x1, a.y1, a.x2, a.y2) - distanceToSegment(hunter.x, hunter.y, b.x1, b.y1, b.x2, b.y2))[0];
    if (!line) return false;
    const dx = line.x2 - line.x1;
    const dy = line.y2 - line.y1;
    const length = Math.hypot(dx, dy) || 1;
    const direction = { x: dx / length, y: dy / length };
    const forward = Math.cos(hunter.angle) * direction.x + Math.sin(hunter.angle) * direction.y >= 0 ? 1 : -1;
    const safe = findNearestSafePosition(
      hunter.x + direction.x * DANCE_SPIN_DISTANCE * forward,
      hunter.y + direction.y * DANCE_SPIN_DISTANCE * forward,
      hunter.radius
    );
    hunter.x = safe.x;
    hunter.y = safe.y;
    hunter.path = [];
    hunter.pathGoal = null;
    hunter.nextDanceSpinAt = now + getDanceSpinCooldown(now);
    showAssistAlert("旋步", now, 700);
    return true;
  }

  function canUseInfiniteDance(now) {
    return matchStarted &&
      isDancer() &&
      hunter.presenceTier >= 2 &&
      !hunter.action &&
      !hunter.carrying &&
      now >= hunter.stunnedUntil &&
      now >= hunter.wipeUntil &&
      now >= (hunter.nextInfiniteDanceAt || 0);
  }

  function useInfiniteDance(now) {
    if (!canUseInfiniteDance(now)) return false;
    hunter.infiniteDanceUntil = now + INFINITE_DANCE_DURATION;
    hunter.nextInfiniteDanceAt = now + INFINITE_DANCE_COOLDOWN;
    showAssistAlert("无穷舞", now, 1000);
    return true;
  }

  function canUseMirrorLight(now) {
    return matchStarted &&
      isMirrorGhost() &&
      hunter.presenceTier >= 1 &&
      mirrorRifts.length > 0 &&
      !hunter.action &&
      !hunter.carrying &&
      now >= hunter.stunnedUntil &&
      now >= hunter.wipeUntil &&
      now >= (hunter.nextMirrorLightAt || 0);
  }

  function useMirrorLight(now) {
    if (!canUseMirrorLight(now)) {
      showAssistAlert(getMirrorLightBlockedReason(now), now, 900);
      return false;
    }
    let affected = 0;
    getSurvivors().forEach((survivor) => {
      if (survivor.escaped || survivor.state === "downed" || survivor.state === "eliminated" || survivor.state === "seated" || survivor.state === "carried") return;
      const source = mirrorRifts.find((rift) => distanceBetween(survivor, rift) <= MIRROR_LIGHT_RADIUS);
      if (!source) return;
      if (isFlywheelActive(survivor, now)) {
        showAssistAlert("飞轮规避镜光", now, 650);
        return;
      }
      if (!tryBlockShieldBearerNegativeStatus(survivor, now, "致盲")) {
        survivor.mirrorBlindUntil = Math.max(survivor.mirrorBlindUntil || 0, now + MIRROR_LIGHT_BLIND_DURATION);
      }
      cancelSurvivorAction(survivor);
      survivor.mirrorTeleportReadyAt = 0;
      maybeTeleportActorThroughMirrorRift(survivor, now, source, true);
      teleportActorNearMirrorGhost(survivor, now);
      affected += 1;
    });
    hunter.nextMirrorLightAt = now + MIRROR_LIGHT_COOLDOWN;
    showAssistAlert(`镜光 ${affected}人`, now, 1000);
    return true;
  }

  function getMirrorLightBlockedReason(now) {
    if (!matchStarted || selectedRole !== PLAYER_ROLE.hunter || !isMirrorGhost()) return "镜光不可用";
    if (hunter.presenceTier < 1) return "需要一阶";
    if (mirrorRifts.length === 0) return "没有裂缝";
    if (hunter.action || hunter.carrying || now < hunter.stunnedUntil || now < hunter.wipeUntil) return "正在行动";
    const cooldown = Math.max(0, (hunter.nextMirrorLightAt || 0) - now);
    return cooldown > 0 ? `镜光冷却${formatCooldown(cooldown)}` : "镜光不可用";
  }

  function maybeTriggerMirrorBloomOnCurtain(actor, x, y) {
    if (!isMirrorGhost() || hunter.presenceTier < 2 || !actor || actor === hunter) return false;
    if (actor.escaped || actor.state === "eliminated" || actor.state === "seated" || actor.state === "carried") return false;
    const hit = mirrorCurtains.some((curtain) => circleHitsSegment(x, y, actor.radius + MIRROR_CURTAIN_THICKNESS * 0.5, curtain));
    if (!hit || performance.now() < (actor.mirrorTeleportReadyAt || 0)) return false;
    teleportActorNearMirrorGhost(actor, performance.now());
    return true;
  }

  function teleportActorNearMirrorGhost(actor, now) {
    const angle = Math.random() * Math.PI * 2;
    const safe = findNearestSafePosition(
      hunter.x + Math.cos(angle) * (hunter.radius + actor.radius + 42),
      hunter.y + Math.sin(angle) * (hunter.radius + actor.radius + 42),
      actor.radius
    );
    actor.x = safe.x;
    actor.y = safe.y;
    actor.vx = 0;
    actor.vy = 0;
    actor.path = [];
    actor.pathGoal = null;
    actor.repathAt = 0;
    actor.mirrorTeleportReadyAt = now + getMirrorTeleportCooldownForActor(actor);
    showAssistAlert("华镜牵引", now, 760);
  }

  function getMirrorTeleportCooldownForActor(actor) {
    return actor === hunter ? MIRROR_RIFT_TELEPORT_COOLDOWN : MIRROR_RIFT_SURVIVOR_TELEPORT_COOLDOWN;
  }

  function getSoulLampLimit() {
    return isLanternKeeper() && hunter.presenceTier >= 2 ? SOUL_LAMP_LIMIT + 1 : SOUL_LAMP_LIMIT;
  }

  function applySurvivorCharacter(survivor, characterId) {
    const config = SURVIVOR_CHARACTERS[characterId] || SURVIVOR_CHARACTERS.clockmaker;
    survivor.characterId = characterId;
    survivor.fill = config.fill;
    survivor.core = config.core;
  }

  function applyHunterCharacter(characterId) {
    const config = HUNTER_CHARACTERS[characterId] || HUNTER_CHARACTERS.standard;
    hunter.characterId = characterId;
    hunter.speed = config.speed * getHunterBadgeMultiplier("speed");
    hunter.baseAttackRange = config.attackRange * getHunterBadgeMultiplier("attackRange");
    hunter.attackRange = hunter.baseAttackRange;
    hunter.attackWindup = Math.max(0.1, Math.min(0.3, config.attackWindup ?? 0.16));
    hunter.attackLunge = config.attackLunge || 0;
    hunter.hitRecoveryMultiplier = config.hitRecovery || 1;
    hunter.missRecoveryMultiplier = config.missRecovery || 1;
  }

  function assignCharactersForMatch() {
    if (selectedRole === PLAYER_ROLE.survivor) {
      hunter.badges = getAIHunterBadges();
      hunter.assistSkill = pickAIHunterAssist();
      applyHunterCharacter(pickAIHunterCharacter());
      applySurvivorCharacter(player, selectedSurvivorCharacter);
      player.badges = selectedSurvivorBadges.slice();
      const remaining = pickAICharacters(teammates.length, [selectedSurvivorCharacter]);
      teammates.forEach((survivor, index) => {
        applySurvivorCharacter(survivor, remaining[index] || AI_SURVIVOR_CHARACTER_ORDER[index]);
        survivor.badges = getAISurvivorBadges(survivor);
      });
      return;
    }

    hunter.badges = selectedHunterBadges.slice();
    hunter.assistSkill = selectedHunterAssist;
    applyHunterCharacter(selectedHunterCharacter);
    const survivorCharacters = previewSurvivorCharacterOrder && previewSurvivorCharacterOrder.length
      ? previewSurvivorCharacterOrder.slice()
      : pickAICharacters(getSurvivors().length);
    getSurvivors().forEach((survivor, index) => {
      applySurvivorCharacter(survivor, survivorCharacters[index] || CLOCKMAKER_ID);
      survivor.badges = getAISurvivorBadges(survivor);
    });
  }

  function getAISurvivorBadges(survivor = null) {
    return ensureBorrowedTimeForRescueRole(survivor, getRandomAIBadges(PLAYER_ROLE.survivor));
  }

  function getAIHunterBadges() {
    return getRandomAIBadges(PLAYER_ROLE.hunter);
  }

  function pickAIHunterAssist() {
    return pickWeighted(AI_HUNTER_ASSIST_ORDER, AI_HUNTER_ASSIST_WEIGHTS, "peeper");
  }

  function getRandomAIBadges(role) {
    const config = BADGE_CONFIG[role] || {};
    const selected = [];
    Object.keys(BADGE_LIMITS).forEach((rarity) => {
      const limit = BADGE_LIMITS[rarity] || 0;
      const pool = Object.keys(config).filter((id) => getBadgeRarity(role, id) === rarity);
      selected.push(...shuffled(pool).slice(0, limit));
    });
    return selected;
  }

  function pickAIHunterCharacter() {
    return pickWeighted(AI_HUNTER_CHARACTER_ORDER, AI_HUNTER_CHARACTER_WEIGHTS, "standard");
  }

  function pickAICharacters(count, excluded = []) {
    const pool = AI_SURVIVOR_CHARACTER_ORDER.filter((id) => !excluded.includes(id));
    const picked = [];
    while (pool.length > 0 && picked.length < count) {
      const characterId = pickWeighted(pool, AI_SURVIVOR_CHARACTER_WEIGHTS, pool[0]);
      picked.push(characterId);
      pool.splice(pool.indexOf(characterId), 1);
    }
    return picked;
  }

  function getSurvivorVaultDuration(actor, baseDuration) {
    const edictSlow = performance.now() < (actor.edictHookSlowUntil || 0) ? EDICTOR_HOOK_VAULT_SLOW : 1;
    const hammerSlow = performance.now() < (actor.hammerVaultSlowUntil || 0) ? HAMMER_VAULT_SLOW : 1;
    return Math.round(baseDuration * getSurvivorMultiplier(actor, "vaultDuration") * getSoulLampVaultSlowdown(actor) * getSoulMarkVaultSlowdown(actor) * edictSlow * hammerSlow / getSurvivorInteractionSpeedMultiplier(actor));
  }

  function getHunterVaultDuration(baseDuration) {
    return Math.round(baseDuration * getHunterCharacter().vaultDuration);
  }

  function getHunterHitRecoveryDuration() {
    return HUNTER_HIT_RECOVERY * getHunterCharacter().hitRecovery * getHunterBadgeMultiplier("hitRecovery") * getBorrowSoulRecoveryMultiplier();
  }

  function getHunterMissRecoveryDuration() {
    return HUNTER_MISS_RECOVERY * getHunterCharacter().missRecovery * getHunterBadgeMultiplier("missRecovery") * getBorrowSoulRecoveryMultiplier();
  }

  function getHunterAttackWindupDuration() {
    return Math.round(Math.max(0.1, Math.min(0.3, hunter.attackWindup || getHunterCharacter().attackWindup || 0.16)) * 1000);
  }

  function getHunterAttackLungeDistance() {
    return hunter.carrying ? 0 : Math.max(0, hunter.attackLunge || getHunterCharacter().attackLunge || 0);
  }

  function isDetentionActive() {
    return hasHunterBadge("detention") && getCompletedRepairCount() >= REPAIR_REQUIRED;
  }

  function getHunterBasicAttackDamage() {
    return 1;
  }

  function isInSoulLampRange(actor) {
    return isLanternKeeper() && soulLamps.some((lamp) => distanceBetween(actor, lamp) <= SOUL_LAMP_RANGE);
  }

  function getHunterMoveSpeed() {
    const twinFormBoost = isTwinForm(TWIN_FORM_CHIYIN) ? 1.32 : isTwinForm(TWIN_FORM_QINGTIAN) ? 1.08 : 1;
    const twinTimeBoost = isTwinSword() && hunter.twinTimePower && hunter.twinTimePower.kind === "self" && performance.now() < hunter.twinTimePower.until
      ? hunter.twinTimePower.factor
      : 1;
    const tunerSlow = performance.now() < (hunter.tunerEchoSlowUntil || 0) ? TUNER_ECHO_SLOW_MULTIPLIER : 1;
    const abyssFormBoost = isAbyssForm() ? ABYSS_FORM_SPEED_MULTIPLIER : 1;
    return hunter.speed * (isInSoulLampRange(hunter) ? SOUL_LAMP_HUNTER_SPEED_BOOST : 1) * twinFormBoost * twinTimeBoost * abyssFormBoost * getSoulSiphonMoveMultiplier() * getBorrowSoulMoveMultiplier() * getSoulPatrolMoveMultiplier() * getPerfumeHunterSpeedMultiplier() * tunerSlow;
  }

  function getSurvivorMoveSpeedMultiplier(actor, now = performance.now(), move = null) {
    const actorBoost = isActor(actor) && isSurvivorInvisible(actor, now) ? ACTOR_HIT_SPEED_BOOST : 1;
    const twinSlow = isTwinSword() && hunter.twinTimePower && hunter.twinTimePower.kind === "survivor" && now < hunter.twinTimePower.until && now >= (actor.shieldTwinTimeImmuneUntil || 0)
      ? 1 / hunter.twinTimePower.factor
      : 1;
    const shackled = now < (actor.shackledUntil || 0) ? 0 : 1;
    const patrollerHold = now < (actor.patrollerHoldUntil || 0) ? 0 : 1;
    const patrollerSlow = now < (actor.patrollerSlowUntil || 0) ? ASSIST_PATROLLER_SLOW : 1;
    const endgameBoost = now < (actor.endgameBoostUntil || 0) ? getSurvivorBadgeMultiplier(actor, "endgameBoost") : 1;
    const perfumeSelfBoost = now < (actor.perfumeBoostUntil || 0) ? PERFUME_SELF_SPEED_BOOST : 1;
    const perfumeUltimateBoost = isInPerfumeUltimateMist(actor, now) ? PERFUME_ULTIMATE_SURVIVOR_SPEED_BOOST : 1;
    const fencerStrideBoost = isFencer(actor) ? 1 + getFencerStrideMarkCount(actor, now) * FENCER_STRIDE_SPEED_PER_MARK : 1;
    const medicFirstChaseBoost = now < (actor.medicFirstChaseUntil || 0) ? MEDIC_FIRST_CHASE_SPEED_BOOST : 1;
    const medicAdrenalineBoost = now < (actor.medicAdrenalineUntil || 0) ? MEDIC_ADRENALINE_SPEED_BOOST : 1;
    const antiqueSprintBoost = now < (actor.antiqueSprintUntil || 0) ? ANTIQUE_SPRINT_SPEED_BOOST : 1;
    const generalRideBoost = isGeneralRiding(actor, now) ? GENERAL_RIDE_SPEED_BOOST + (actor.generalRideWhips || 0) * GENERAL_WHIP_SPEED_BOOST : 1;
    const shieldGuardSlow = isShieldBearerGuarding(actor, now) ? SHIELD_GUARD_MOVE_MULTIPLIER : 1;
    const kneeJerkBoost = now < (actor.kneeJerkBoostUntil || 0) ? KNEE_JERK_SPEED_BOOST : 1;
    const fighterRescueRush = getFighterRescueRushMultiplier(actor, now, move);
    const abyssWhisperSlow = now < (actor.abyssWhisperUntil || 0) ? ABYSS_WHISPER_MOVE_MULTIPLIER : 1;
    return getBoneBleedSpeedMultiplier(actor, now) * getSoulMarkMoveMultiplier(actor) * actorBoost * twinSlow * shackled * patrollerHold * patrollerSlow * endgameBoost * perfumeSelfBoost * perfumeUltimateBoost * fencerStrideBoost * medicFirstChaseBoost * medicAdrenalineBoost * antiqueSprintBoost * generalRideBoost * shieldGuardSlow * kneeJerkBoost * abyssWhisperSlow * fighterRescueRush;
  }

  function getFighterRescueRushMultiplier(actor, now = performance.now(), move = null) {
    const carried = hunter.carrying;
    if (!isFighter(actor) || !carried || carried === actor || carried.state !== "carried" || actor.escaped) return 1;
    const dx = carried.x - actor.x;
    const dy = carried.y - actor.y;
    const distance = Math.hypot(dx, dy);
    if (distance > FIGHTER_RESCUE_RUSH_RANGE || distance < 0.001) return 1;
    if (move && move.length > 0.1) {
      const towardCarried = (move.x * dx + move.y * dy) / distance;
      if (towardCarried < 0.25) return 1;
    }
    return FIGHTER_RESCUE_RUSH_MULTIPLIER;
  }

  function getDownedCrawlSpeed(actor) {
    const emberBurst = hasSurvivorBadge(actor, "ember") && actor.downedAt && performance.now() - actor.downedAt < EMBER_DOWNED_BOOST_DURATION
      ? EMBER_DOWNED_CRAWL_MULTIPLIER
      : 1;
    return DOWNED_CRAWL_SPEED * getSurvivorMultiplier(actor, "crawlSpeed") * emberBurst;
  }

  function getFencerStrideMarkCount(actor, now = performance.now()) {
    if (!isFencer(actor)) return 0;
    actor.fencerStrideMarks = (actor.fencerStrideMarks || []).filter((until) => now < until);
    return actor.fencerStrideMarks.length;
  }

  function maybeAddFencerStrideMark(actor, move, now) {
    if (!isFencer(actor)) return;
    if (move.length <= 0.1) return;

    const angle = Math.atan2(move.y, move.x);
    if (!Number.isFinite(actor.fencerLastSprintAngle)) {
      actor.fencerLastSprintAngle = angle;
      return;
    }

    const diff = Math.abs(angleDifference(angle, actor.fencerLastSprintAngle));
    actor.fencerLastSprintAngle = angle;
    if (diff < FENCER_STRIDE_TURN_THRESHOLD || now < (actor.fencerNextStrideAt || 0)) return;

    const until = now + FENCER_STRIDE_MARK_DURATION;
    actor.fencerStrideMarks = (actor.fencerStrideMarks || []).filter((markUntil) => now < markUntil);
    actor.fencerStrideMarks.push(until);
    if (actor.fencerStrideMarks.length > FENCER_STRIDE_MAX_MARKS) {
      actor.fencerStrideMarks = actor.fencerStrideMarks.slice(actor.fencerStrideMarks.length - FENCER_STRIDE_MAX_MARKS);
    }
    actor.fencerStrideMarks = actor.fencerStrideMarks.map(() => until);
    actor.fencerNextStrideAt = now + FENCER_STRIDE_TRIGGER_COOLDOWN;
  }

  function getPerfumeHunterSpeedMultiplier(now = performance.now()) {
    return isHunterInPerfumeMist(now) ? PERFUME_HUNTER_SPEED_MULTIPLIER : 1;
  }

  function getBoneBleedStacks(actor, now = performance.now()) {
    if (!actor || !Array.isArray(actor.bleedStacks)) return 0;
    return actor.bleedStacks.filter((expiresAt) => expiresAt > now).length;
  }

  function getBoneBleedSpeedMultiplier(actor, now = performance.now()) {
    const stacks = getBoneBleedStacks(actor, now);
    if (stacks <= 0) return 1;
    const slowPerStack = hunter.presenceTier >= 2 ? BONE_BLEED_TIER_TWO_SLOW : BONE_BLEED_SLOW;
    return Math.max(0.64, 1 - stacks * slowPerStack);
  }

  function pruneBoneBleed(actor, now) {
    if (!actor || !Array.isArray(actor.bleedStacks) || actor.bleedStacks.length === 0) return;
    actor.bleedStacks = actor.bleedStacks.filter((expiresAt) => expiresAt > now);
  }

  function applyBoneBleed(actor, now) {
    if (!actor || actor.escaped || actor.state === "eliminated") return;
    if (tryBlockShieldBearerNegativeStatus(actor, now, "流血")) return;
    pruneBoneBleed(actor, now);
    actor.bleedStacks.push(now + BONE_BLEED_DURATION);
    actor.bleedStacks.sort((a, b) => a - b);
    if (actor.bleedStacks.length > BONE_BLEED_MAX_STACKS) {
      actor.bleedStacks = actor.bleedStacks.slice(actor.bleedStacks.length - BONE_BLEED_MAX_STACKS);
    }
  }

  function getSoulMarks(survivor) {
    const maxMarks = isSoulBinderPracticeMode() ? SOUL_BINDER_PRACTICE_SOUL_MARKS : SOUL_MARK_MAX;
    return actorClamp(survivor && survivor.soulMarks || 0, 0, maxMarks);
  }

  function addSoulMark(survivor, amount = 1, now = performance.now()) {
    if (!survivor || survivor.escaped || survivor.state === "eliminated") return 0;
    if (tryBlockShieldBearerNegativeStatus(survivor, now, "魂印")) return 0;
    const before = getSoulMarks(survivor);
    const maxMarks = isSoulBinderPracticeMode() ? SOUL_BINDER_PRACTICE_SOUL_MARKS : SOUL_MARK_MAX;
    survivor.soulMarks = Math.min(maxMarks, before + amount);
    return survivor.soulMarks - before;
  }

  function clearOneSoulMark(survivor) {
    if (!survivor || getSoulMarks(survivor) <= 0) return false;
    survivor.soulMarks = Math.max(0, getSoulMarks(survivor) - 1);
    return true;
  }

  function getSoulMarkMoveMultiplier(survivor) {
    return getSoulMarks(survivor) >= 3 ? SOUL_MARK_MOVE_SLOW : 1;
  }

  function getSoulSiphonMoveMultiplier(now = performance.now()) {
    if (!isSoulBinder()) return 1;
    if (now < (hunter.soulSiphonPenaltyUntil || 0)) return SOUL_SIPHON_FAIL_SLOW;
    if (!hunter.soulSiphonTarget || now >= (hunter.soulSiphonUntil || 0)) return 1;
    if (selectedRole !== PLAYER_ROLE.hunter) {
      return hunter.target === hunter.soulSiphonTarget ? SOUL_SIPHON_SPEED_BOOST : 1;
    }
    const move = getMoveVector();
    if (move.length <= 0.1) return 1;
    const toTarget = normalizeVector(hunter.soulSiphonTarget.x - hunter.x, hunter.soulSiphonTarget.y - hunter.y);
    const alignment = move.x * toTarget.x + move.y * toTarget.y;
    return alignment > 0.35 ? SOUL_SIPHON_SPEED_BOOST : 1;
  }

  function isSoulSiphonPhasing(now = performance.now()) {
    return isSoulBinder() && Boolean(hunter.soulSiphonTarget) && now < (hunter.soulSiphonUntil || 0);
  }

  function isSoulSiphonPhaseMove(dx, dy, now = performance.now()) {
    if (!isSoulSiphonPhasing(now)) return false;
    const move = normalizeVector(dx, dy);
    if (!move.x && !move.y) return false;
    const toTarget = normalizeVector(hunter.soulSiphonTarget.x - hunter.x, hunter.soulSiphonTarget.y - hunter.y);
    return move.x * toTarget.x + move.y * toTarget.y > 0.35;
  }

  function getBorrowSoulMoveMultiplier(now = performance.now()) {
    return isSoulBinder() && now < (hunter.borrowSoulUntil || 0) ? 1 + (hunter.borrowSoulSpeedBonus || 0) : 1;
  }

  function getBorrowSoulRecoveryMultiplier(now = performance.now()) {
    return isSoulBinder() && now < (hunter.borrowSoulUntil || 0) ? Math.max(0.45, 1 - (hunter.borrowSoulRecoveryBonus || 0)) : 1;
  }

  function isSoulPatrolActive(now = performance.now()) {
    return isSoulBinder() && now < (hunter.soulPatrolUntil || 0);
  }

  function getSoulPatrolMoveMultiplier(now = performance.now()) {
    return isSoulPatrolActive(now) ? SOUL_PATROL_SPEED_BOOST : 1;
  }

  function isSurvivorInvisible(survivor, now = performance.now()) {
    return Boolean(survivor && now < (survivor.invisibleUntil || 0));
  }

  function isHunterInvisibleToSurvivors(now = performance.now()) {
    return isTwinSword() && (isTwinForm(TWIN_FORM_CHIYIN) || now < (hunter.invisibleUntil || 0));
  }

  function canAISurvivorSeeHunter(now = performance.now()) {
    return !isHunterInvisibleToSurvivors(now);
  }

  function canAISurvivorSensePoolYin(survivor, now = performance.now()) {
    return isTwinSword() &&
      isTwinForm(TWIN_FORM_CHIYIN) &&
      ((survivor.shackleValue || 0) > 0 || now < (survivor.shackledUntil || 0)) &&
      distanceBetween(survivor, hunter) <= TWIN_GAZE_RANGE;
  }

  function shouldHideSurvivorFromHunterView(survivor, now = performance.now()) {
    if (isAssistRevealed(survivor, now)) return false;
    if (isSoulBinder() && getSoulMarks(survivor) >= 3) return false;
    return selectedRole === PLAYER_ROLE.hunter && isSurvivorInvisible(survivor, now);
  }

  function getSoulLampVaultSlowdown(actor) {
    return isInSoulLampRange(actor) ? SOUL_LAMP_SURVIVOR_VAULT_SLOWDOWN : 1;
  }

  function getSoulMarkVaultSlowdown(actor) {
    return getSoulMarks(actor) >= 2 ? SOUL_MARK_VAULT_SLOWDOWN : 1;
  }

  function getSurvivorRepairDuration(actor, baseDuration) {
    return Math.round(baseDuration * getSurvivorMultiplier(actor, "repairDuration"));
  }

  function getSurvivorRescueDuration(actor) {
    return Math.round(RESCUE_DURATION * getSurvivorMultiplier(actor, "rescueDuration") / getSurvivorInteractionSpeedMultiplier(actor));
  }

  function getSurvivorHitBoostDuration(actor, baseDuration) {
    return Math.round(baseDuration * getSurvivorMultiplier(actor, "hitBoostDuration"));
  }

  function getSurvivorHealPower(actor) {
    return getSurvivorMultiplier(actor, "healPower") * getSurvivorInteractionSpeedMultiplier(actor) * getSoulMarkHealPowerMultiplier(actor);
  }

  function getSoulMarkHealPowerMultiplier(actor) {
    return getSoulMarks(actor) >= 2 ? SOUL_MARK_HEAL_POWER_MULTIPLIER : 1;
  }

  function getRepairSpeedMultiplier(actor) {
    const soulSpeed = getSoulMarks(actor) >= 1 ? 1 / SOUL_MARK_REPAIR_SLOWDOWN : 1;
    const actionSpeed = getSurvivorInteractionSpeedMultiplier(actor) * soulSpeed;
    if (isLanternKeeper() && distanceBetween(actor, hunter) <= LANTERN_AURA_RANGE) {
      return LANTERN_REPAIR_SLOWDOWN * actionSpeed;
    }
    return actionSpeed;
  }

  function getSurvivorInteractionSpeedMultiplier(actor, now = performance.now()) {
    const abyssWhisperSlow = now < (actor.abyssWhisperUntil || 0) ? ABYSS_WHISPER_INTERACTION_MULTIPLIER : 1;
    return getTwinSurvivorActionSpeedMultiplier(actor, now) * abyssWhisperSlow *
      getPeeperInteractionSpeedMultiplier(actor, now) *
      getDanceErosionInteractionMultiplier(actor);
  }

  function getDanceErosionStacks(survivor) {
    return Math.max(0, Number(survivor && survivor.danceErosion) || 0);
  }

  function getDanceErosionMax() {
    return DANCE_EROSION_MAX;
  }

  function addDanceErosion(survivor, amount = 1, now = performance.now()) {
    if (!survivor || survivor.escaped || survivor.state === "eliminated") return 0;
    if (tryBlockShieldBearerNegativeStatus(survivor, now, "侵蚀")) return 0;
    const before = getDanceErosionStacks(survivor);
    survivor.danceErosion = Math.min(getDanceErosionMax(), before + amount);
    return survivor.danceErosion - before;
  }

  function getDanceErosionInteractionMultiplier(actor) {
    return Math.pow(DANCE_EROSION_INTERACTION_MULTIPLIER, getDanceErosionStacks(actor));
  }

  function getPeeperInteractionSpeedMultiplier(actor, now = performance.now()) {
    if (!actor || assistPeeperWards.length === 0) return 1;
    return assistPeeperWards.some((ward) => now < ward.until && distanceBetween(actor, ward) <= ASSIST_PEEPER_RANGE)
      ? ASSIST_PEEPER_INTERACTION_SPEED
      : 1;
  }

  function getTwinSurvivorActionSpeedMultiplier(actor, now = performance.now()) {
    if (!actor || !isTwinSword()) return 1;
    if (hunter.twinTimePower && hunter.twinTimePower.kind === "survivor" && now < hunter.twinTimePower.until) {
      return 1 / hunter.twinTimePower.factor;
    }
    return 1;
  }

  function getSoulLampCooldownLeft(now) {
    return Math.max(0, nextSoulLampAt - now);
  }

  function getShadowTeleportCooldownLeft(now) {
    return Math.max(0, (hunter.nextShadowTeleportAt || 0) - now);
  }

  function getSawDashCooldownLeft(now) {
    if (isInfiniteSawboneMode()) return 0;
    if (canUseShortSaw(now)) return 0;
    return Math.max(0, (hunter.nextSawDashAt || 0) - now);
  }

  function getSawAttackLockoutLeft(now) {
    return Math.max(0, (hunter.sawAttackLockedUntil || 0) - now);
  }

  function getFencerLungeCooldownLeft(actor, now) {
    return Math.max(0, (actor.nextFencerLungeAt || 0) - now);
  }

  function getAntiqueSkillCooldownLeft(actor, key, now = performance.now()) {
    const property = {
      1: "nextAntiqueSweepLeftAt",
      2: "nextAntiqueThrustAt",
      3: "nextAntiqueSweepRightAt",
      4: "nextAntiqueLeapAt",
      5: "nextAntiqueSprintAt"
    }[key];
    return property ? Math.max(0, (actor[property] || 0) - now) : Infinity;
  }

  function getAntiqueSkillCooldownProperty(key) {
    return {
      1: "nextAntiqueSweepLeftAt",
      2: "nextAntiqueThrustAt",
      3: "nextAntiqueSweepRightAt",
      4: "nextAntiqueLeapAt",
      5: "nextAntiqueSprintAt"
    }[key] || null;
  }

  function getAntiqueSkillDurabilityCost(key) {
    if (key >= 1 && key <= 3) return ANTIQUE_FLUTE_STRIKE_DURABILITY_COST;
    if (key === 4) return ANTIQUE_FLUTE_LEAP_DURABILITY_COST;
    if (key === 5) return ANTIQUE_FLUTE_SPRINT_DURABILITY_COST;
    return Infinity;
  }

  function restoreAntiqueFluteDurability(actor, now = performance.now()) {
    if (!actor || !isAntiqueDealer(actor)) return false;
    if ((actor.antiqueDurability || 0) > 0 || now < (actor.antiqueFluteLockedUntil || 0)) return false;
    actor.antiqueDurability = ANTIQUE_FLUTE_DURABILITY_MAX;
    actor.antiqueFluteLockedUntil = 0;
    return true;
  }

  function getAntiqueFluteRecoveryLeft(actor, now = performance.now()) {
    return Math.max(0, (actor.antiqueFluteLockedUntil || 0) - now);
  }

  function consumeAntiqueFluteDurability(actor, key, now) {
    const cost = getAntiqueSkillDurabilityCost(key);
    const durability = Math.max(0, actor.antiqueDurability || 0);
    const deficit = Math.max(0, cost - durability);
    actor.antiqueDurability = Math.max(0, durability - cost);
    if (actor.antiqueDurability <= 0) {
      actor.antiqueFluteOpen = false;
      actor.antiqueFluteLockedUntil = now + ANTIQUE_FLUTE_RECOVERY_LOCK;
      showAssistAlert(deficit > 0 ? `耐久透支 · 冷却+${deficit}秒` : "机关箫耗尽 · 25秒后恢复", now, 950);
    }
    return deficit;
  }

  function canUseAntiqueSkill(actor, key, now = performance.now()) {
    restoreAntiqueFluteDurability(actor, now);
    return matchStarted &&
      isAntiqueDealer(actor) &&
      actor.antiqueFluteOpen &&
      !actor.action &&
      !actor.escaped &&
      (actor.state === "healthy" || actor.state === "injured") &&
      getAntiqueSkillCooldownLeft(actor, key, now) <= 0;
  }

  function toggleAntiqueFlute(actor, now = performance.now()) {
    if (!matchStarted || !isAntiqueDealer(actor) || actor.action || actor.escaped || actor.state !== "healthy" && actor.state !== "injured") return false;
    restoreAntiqueFluteDurability(actor, now);
    const recoveryLeft = getAntiqueFluteRecoveryLeft(actor, now);
    if (!actor.antiqueFluteOpen && recoveryLeft > 0) {
      showAssistAlert(`机关箫恢复${Math.ceil(recoveryLeft / 1000)}秒`, now, 860);
      return false;
    }
    actor.antiqueFluteOpen = !actor.antiqueFluteOpen;
    showAssistAlert(actor.antiqueFluteOpen ? `机关箫展开 · 耐久${actor.antiqueDurability}` : "机关箫收起", now, 760);
    return true;
  }

  function startAntiqueFluteSkill(actor, key, now = performance.now()) {
    if (!canUseAntiqueSkill(actor, key, now)) return false;
    const property = getAntiqueSkillCooldownProperty(key);
    actor[property] = now + ANTIQUE_SKILL_COOLDOWN;
    if (key === 4) {
      if (!startAntiqueLeap(actor, now)) return false;
      actor[property] = now + ANTIQUE_SKILL_COOLDOWN + consumeAntiqueFluteDurability(actor, key, now) * 1000;
      return true;
    }
    if (key === 5) {
      actor.antiqueSprintUntil = now + ANTIQUE_SPRINT_DURATION;
      actor[property] = now + ANTIQUE_SKILL_COOLDOWN + consumeAntiqueFluteDurability(actor, key, now) * 1000;
      showAssistAlert("转式加速", now, 760);
      return true;
    }

    actor.action = {
      kind: "antiqueFluteStrike",
      start: now,
      until: now + ANTIQUE_STRIKE_DURATION,
      hitAt: now + ANTIQUE_STRIKE_WINDUP,
      key,
      angle: actor.angle || 0,
      range: key === 2 ? ANTIQUE_THRUST_RANGE : ANTIQUE_SWEEP_RANGE,
      arc: key === 2 ? ANTIQUE_THRUST_ARC : ANTIQUE_SWEEP_ARC,
      swingDirection: key === 1 ? -1 : key === 3 ? 1 : 0,
      hitHunter: false
    };
    actor[property] = now + ANTIQUE_SKILL_COOLDOWN + consumeAntiqueFluteDurability(actor, key, now) * 1000;
    showAssistAlert(key === 1 ? "扫式" : key === 2 ? "点刺" : "抡式", now, 620);
    return true;
  }

  function isHunterHitByAntiqueStrike(actor, action) {
    const dx = hunter.x - actor.x;
    const dy = hunter.y - actor.y;
    const distance = Math.hypot(dx, dy);
    if (distance > action.range + hunter.radius) return false;
    return Math.abs(angleDifference(Math.atan2(dy, dx), action.angle)) <= action.arc * 0.5;
  }

  function hasAntiqueDealerNearbyTeammate(actor) {
    return getSurvivors().some((teammate) => {
      return teammate !== actor &&
        !teammate.escaped &&
        teammate.state !== "eliminated" &&
        distanceBetween(actor, teammate) <= HEARTBEAT_RANGE;
    });
  }

  function applyAntiqueWallCombo(actor, now) {
    const withinCombo = now - (actor.antiqueLastWallHitAt || 0) <= ANTIQUE_COMBO_WINDOW;
    actor.antiqueWallCombo = withinCombo ? Math.min(3, (actor.antiqueWallCombo || 0) + 1) : 1;
    actor.antiqueLastWallHitAt = now;
    const hasActiveStop = now < (hunter.stopAttackUntil || 0);
    actor.antiqueWallStopTier = hasActiveStop ? Math.min(3, (actor.antiqueWallStopTier || 0) + 1) : 1;
    const baseDuration = ANTIQUE_STOP_ATTACK_DURATIONS[actor.antiqueWallStopTier - 1] + (withinCombo ? ANTIQUE_STOP_ATTACK_COMBO_BONUS[actor.antiqueWallStopTier - 1] : 0);
    const duration = baseDuration * (hasAntiqueDealerNearbyTeammate(actor) ? 0.5 : 1);
    const previousUntil = Math.max(now, hunter.stopAttackUntil || 0);
    hunter.stopAttackUntil = Math.min(now + ANTIQUE_STOP_ATTACK_MAX_DURATION, previousUntil + duration);
    const addedDuration = hunter.stopAttackUntil - previousUntil;
    const totalSeconds = Math.ceil((hunter.stopAttackUntil - now) / 1000);
    antiqueEffects.push({ kind: "stopAttack", until: now + 1000, combo: actor.antiqueWallCombo });
    const comboLabel = withinCombo ? "连棍" : "棍";
    showAssistAlert(`第${actor.antiqueWallStopTier}${comboLabel} · 止戈+${(addedDuration / 1000).toFixed(addedDuration % 1000 ? 1 : 0)}秒（共${totalSeconds}秒）`, now, 1050);
  }

  function knockbackHunterFromAntiqueStrike(actor, angle, now, swingDirection = 0) {
    const dx = Math.cos(angle) * ANTIQUE_KNOCKBACK;
    const dy = Math.sin(angle) * ANTIQUE_KNOCKBACK;
    const targetX = hunter.x + dx;
    const targetY = hunter.y + dy;
    const targetBlocked = !isSafePosition(targetX, targetY, hunter.radius);
    const beforeX = hunter.x;
    const beforeY = hunter.y;
    const moved = moveActorSmart(hunter, dx, dy, { forceCollision: true });
    const blocked = targetBlocked || moved < ANTIQUE_KNOCKBACK * 0.72;

    hunter.vx = (hunter.x - beforeX) / Math.max(ANTIQUE_STRIKE_DURATION / 1000, 0.001);
    hunter.vy = (hunter.y - beforeY) / Math.max(ANTIQUE_STRIKE_DURATION / 1000, 0.001);
    hunter.path = [];
    hunter.pathGoal = null;
    cancelSawDashByControl(now);
    cancelDanceStepByControl(now);
    chasePulseUntil = now + 320;

    if (!blocked) {
      antiqueEffects.push({ kind: "hit", x: hunter.x, y: hunter.y, angle, swingDirection, until: now + 460 });
      showAssistAlert("机关箫击退", now, 700);
      return;
    }

    antiqueEffects.push({ kind: "wall", x: hunter.x, y: hunter.y, angle, swingDirection, until: now + 620 });
    const stunBefore = hunter.stunnedUntil || 0;
    interruptHunterByStun(now, ANTIQUE_WALL_STUN);
    if ((hunter.stunnedUntil || 0) > stunBefore) applyAntiqueWallCombo(actor, now);
    else showAssistAlert("机关箫撞墙", now, 760);
  }

  function isThinAntiqueLeapObstacle(obstacle) {
    return Boolean(obstacle && (obstacle.blinkPhaseable || Math.min(obstacle.w, obstacle.h) <= ANTIQUE_LEAP_MAX_OBSTACLE_THICKNESS));
  }

  function getAntiqueLeapBarrier(actor, angle) {
    const directionX = Math.cos(angle);
    const directionY = Math.sin(angle);
    const candidates = windows.map((item) => ({
      kind: "window",
      item,
      rect: getWindowCollisionRect(item)
    })).concat(pallets.filter((item) => item.label !== "broken").map((item) => ({
      kind: "pallet",
      item,
      rect: getPalletCollisionRect(item)
    })));
    let nearest = null;
    candidates.forEach((candidate) => {
      const dx = candidate.item.x - actor.x;
      const dy = candidate.item.y - actor.y;
      const forward = dx * directionX + dy * directionY;
      const lateral = Math.abs(dx * -directionY + dy * directionX);
      const halfDepth = Math.abs(directionX) * candidate.rect.w * 0.5 + Math.abs(directionY) * candidate.rect.h * 0.5;
      const halfWidth = Math.abs(directionY) * candidate.rect.w * 0.5 + Math.abs(directionX) * candidate.rect.h * 0.5;
      if (forward < -halfDepth || forward > ANTIQUE_LEAP_DISTANCE + halfDepth || lateral > halfWidth + actor.radius + 26) return;
      if (!nearest || forward < nearest.forward) nearest = { ...candidate, forward, halfDepth, halfWidth };
    });
    return nearest;
  }

  function findAntiqueLeapBarrierLanding(actor, barrier, angle) {
    const directionX = Math.cos(angle);
    const directionY = Math.sin(angle);
    const startOffset = barrier.halfDepth + actor.radius + 18;
    for (let offset = startOffset; offset <= startOffset + 144; offset += 12) {
      const x = barrier.item.x + directionX * offset;
      const y = barrier.item.y + directionY * offset;
      if (isSafePosition(x, y, actor.radius)) return { x, y };
    }
    return null;
  }

  function canAntiqueLeapTo(actor, targetX, targetY, barrier = null) {
    if (!isSafePosition(targetX, targetY, actor.radius)) return false;
    const distance = Math.hypot(targetX - actor.x, targetY - actor.y);
    const steps = Math.max(1, Math.ceil(distance / MOVE_COLLISION_STEP));
    for (let step = 1; step < steps; step += 1) {
      const ratio = step / steps;
      const x = actor.x + (targetX - actor.x) * ratio;
      const y = actor.y + (targetY - actor.y) * ratio;
      const obstacle = getCollisionRects().find((item) => circleHitsRect(x, y, actor.radius, item));
      const inBarrierPassZone = barrier && Math.hypot(x - barrier.item.x, y - barrier.item.y) <= Math.max(barrier.rect.w, barrier.rect.h) * 0.82 + actor.radius;
      if (obstacle && !isThinAntiqueLeapObstacle(obstacle) && !inBarrierPassZone) return false;
    }
    return true;
  }

  function startAntiqueLeap(actor, now) {
    const angle = actor.angle || 0;
    const barrier = getAntiqueLeapBarrier(actor, angle);
    const barrierLanding = barrier ? findAntiqueLeapBarrierLanding(actor, barrier, angle) : null;
    const targetX = barrierLanding ? barrierLanding.x : actor.x + Math.cos(angle) * ANTIQUE_LEAP_DISTANCE;
    const targetY = barrierLanding ? barrierLanding.y : actor.y + Math.sin(angle) * ANTIQUE_LEAP_DISTANCE;
    if (barrier && !barrierLanding || !canAntiqueLeapTo(actor, targetX, targetY, barrier)) {
      actor.nextAntiqueLeapAt = now;
      showAssistAlert(barrier ? "窗板另一侧无法落脚" : "前方厚墙无法云门跳跃", now, 900);
      return false;
    }
    actor.action = {
      kind: "antiqueLeap",
      start: now,
      until: now + ANTIQUE_LEAP_DURATION,
      fromX: actor.x,
      fromY: actor.y,
      toX: targetX,
      toY: targetY,
      angle
    };
    showAssistAlert(barrier ? barrier.kind === "window" ? "云门过窗" : "云门越板" : "云门跳跃", now, 700);
    return true;
  }

  function getFlywheelCooldownLeft(actor, now) {
    return Math.max(0, (actor.nextFlywheelAt || 0) - now);
  }

  function getMedicAdrenalineCooldownLeft(actor, now) {
    return Math.max(0, (actor.nextMedicAdrenalineAt || 0) - now);
  }

  function getGeneralRideCooldownLeft(actor, now) {
    return Math.max(0, (actor.nextGeneralRideAt || 0) - now);
  }

  function getGeneralWhipCooldownLeft(actor, now) {
    return Math.max(0, (actor.nextGeneralWhipAt || 0) - now);
  }

  function isGeneralRiding(actor, now = performance.now()) {
    return Boolean(isGeneral(actor) && (actor.state === "healthy" || actor.state === "injured") && now < (actor.generalRideUntil || 0));
  }

  function getGeneralRideSecondsLeft(actor, now = performance.now()) {
    return Math.max(0, Math.ceil(((actor && actor.generalRideUntil || 0) - now) / 1000));
  }

  function canUseGeneralSkill(actor, now) {
    return matchStarted &&
      isGeneral(actor) &&
      !actor.action &&
      !actor.escaped &&
      (actor.state === "healthy" || actor.state === "injured") &&
      (isGeneralRiding(actor, now) ? isGeneralRamReady(actor) || getGeneralWhipCooldownLeft(actor, now) <= 0 : getGeneralRideCooldownLeft(actor, now) <= 0);
  }

  function useGeneralSkill(actor, now) {
    if (!canUseGeneralSkill(actor, now)) return false;
    if (isGeneralRiding(actor, now) && isGeneralRamReady(actor)) return startGeneralRam(actor, now);
    if (isGeneralRiding(actor, now)) return whipGeneralHorse(actor, now);
    return startGeneralRide(actor, now);
  }

  function startGeneralRide(actor, now) {
    actor.generalRideUntil = now + GENERAL_RIDE_DURATION;
    actor.generalRideWhips = 0;
    actor.generalRage = 0;
    actor.nextGeneralWhipAt = now;
    showAssistAlert("骑马", now, 900);
    return true;
  }

  function whipGeneralHorse(actor, now) {
    actor.generalRideWhips = (actor.generalRideWhips || 0) + 1;
    actor.nextGeneralWhipAt = now + GENERAL_WHIP_COOLDOWN;
    showAssistAlert(`鞭策 +${actor.generalRideWhips * 5}%`, now, 760);
    return true;
  }

  function finishGeneralRide(actor, now, reason = "timeout") {
    if (!actor || !isGeneral(actor) || !actor.generalRideUntil) return false;
    actor.generalRideUntil = 0;
    actor.generalRideWhips = 0;
    actor.nextGeneralWhipAt = 0;
    actor.generalRage = 0;
    actor.nextGeneralRideAt = now + GENERAL_RIDE_COOLDOWN;
    if (reason === "hit") showAssistAlert("落马免伤", now, 900);
    if (reason === "manual") showAssistAlert("主动下马", now, 800);
    return true;
  }

  function getShieldGuardCooldownLeft(actor, now = performance.now()) {
    return Math.max(0, (actor && actor.nextShieldGuardAt || 0) - now);
  }

  function isShieldBearerGuarding(actor, now = performance.now()) {
    return Boolean(
      isShieldBearer(actor) &&
      (actor.state === "healthy" || actor.state === "injured") &&
      now < (actor.shieldGuardUntil || 0)
    );
  }

  function canUseShieldGuard(actor, now = performance.now()) {
    return matchStarted &&
      isShieldBearer(actor) &&
      !actor.action &&
      !actor.escaped &&
      (actor.state === "healthy" || actor.state === "injured") &&
      !isShieldBearerGuarding(actor, now) &&
      getShieldGuardCooldownLeft(actor, now) <= 0;
  }

  function useShieldGuard(actor, now = performance.now()) {
    if (!canUseShieldGuard(actor, now)) return false;
    actor.shieldGuardUntil = now + SHIELD_GUARD_DURATION;
    actor.nextShieldGuardAt = now + SHIELD_GUARD_COOLDOWN;
    actor.vx = 0;
    actor.vy = 0;
    showAssistAlert("大盾手 举盾", now, 800);
    return true;
  }

  function tryBlockShieldBearerNegativeStatus(actor, now = performance.now(), label = "负面状态") {
    if (!isShieldBearer(actor) || actor.escaped || actor.state === "eliminated") return false;
    if (now < (actor.nextShieldToughnessAt || 0)) return false;
    actor.nextShieldToughnessAt = now + SHIELD_BEARER_TOUGHNESS_COOLDOWN;
    showAssistAlert(`坚强抵消${label}`, now, 850);
    return true;
  }

  function isShieldGuardFacingHunter(actor) {
    if (!actor) return false;
    const sourceAngle = Math.atan2(hunter.y - actor.y, hunter.x - actor.x);
    return Math.abs(angleDifference(actor.angle || 0, sourceAngle)) <= SHIELD_GUARD_FRONT_ARC / 2;
  }

  function applyShieldGuardDamageReduction(amount, options = {}) {
    if (!Number.isFinite(amount) || !options.shieldGuardDamageReduction) return amount;
    return Math.max(0, amount - options.shieldGuardDamageReduction);
  }

  function knockShieldBearerBackward(actor) {
    if (!actor) return;
    const angle = (actor.angle || 0) + Math.PI;
    moveActorSmart(actor, Math.cos(angle) * SHIELD_GUARD_KNOCKBACK, Math.sin(angle) * SHIELD_GUARD_KNOCKBACK);
    actor.path = [];
    actor.pathGoal = null;
    actor.repathAt = 0;
  }

  function isGeneralRamReady(actor) {
    return (actor && actor.generalRage || 0) >= GENERAL_RAGE_MAX;
  }

  function updateGeneralRage(actor, now, dt) {
    if (!isGeneralRiding(actor, now) || actor.action && actor.action.kind === "generalRam") {
      actor.generalRage = 0;
      return;
    }
    if (actor.escaped || actor.state !== "healthy" && actor.state !== "injured") {
      actor.generalRage = 0;
      return;
    }
    const chased = hunter.target === actor && distanceBetween(actor, hunter) <= GENERAL_RAGE_CHASE_RANGE;
    if (!chased) return;
    actor.generalRage = Math.min(GENERAL_RAGE_MAX, (actor.generalRage || 0) + GENERAL_RAGE_GAIN_PER_SECOND * dt);
  }

  function startGeneralRam(actor, now) {
    if (!isGeneralRamReady(actor) || !isGeneralRiding(actor, now)) return false;
    const angle = Math.atan2(hunter.y - actor.y, hunter.x - actor.x);
    actor.generalRage = 0;
    actor.action = {
      kind: "generalRam",
      start: now,
      lastUpdate: now,
      until: now + GENERAL_RAM_WINDUP + GENERAL_RAM_DURATION,
      phase: "backstep",
      angle: Number.isFinite(angle) ? angle : actor.angle || 0,
      backstepDistance: 0,
      dashDistance: 0,
      hitHunter: false
    };
    showAssistAlert("后撤助跑", now, 700);
    return true;
  }

  function ramHunterFromGeneral(actor, now) {
    let angle = Math.atan2(hunter.y - actor.y, hunter.x - actor.x);
    if (!Number.isFinite(angle) || Math.hypot(hunter.x - actor.x, hunter.y - actor.y) < 1) {
      angle = Number.isFinite(actor.angle) ? actor.angle : 0;
    }

    const dx = Math.cos(angle) * GENERAL_RAM_KNOCKBACK;
    const dy = Math.sin(angle) * GENERAL_RAM_KNOCKBACK;
    const targetX = hunter.x + dx;
    const targetY = hunter.y + dy;
    const targetBlocked = !isSafePosition(targetX, targetY, hunter.radius);
    const beforeX = hunter.x;
    const beforeY = hunter.y;
    const moved = moveActorSmart(hunter, dx, dy, { forceCollision: true });
    const blocked = targetBlocked || moved < GENERAL_RAM_KNOCKBACK * 0.72;

    hunter.vx = (hunter.x - beforeX) / Math.max(GENERAL_RAM_DURATION / 1000, 0.001);
    hunter.vy = (hunter.y - beforeY) / Math.max(GENERAL_RAM_DURATION / 1000, 0.001);
    hunter.path = [];
    hunter.pathGoal = null;
    chasePulseUntil = now + 320;
    cancelSawDashByControl(now);
    cancelDanceStepByControl(now);

    if (blocked) {
      showAssistAlert("铁骑撞墙", now, 900);
      interruptHunterByStun(now, GENERAL_RAM_WALL_STUN);
      return;
    }

    showAssistAlert("铁骑击退", now, 700);
  }

  function finishGeneralRam(actor) {
    if (!actor || !actor.action || actor.action.kind !== "generalRam") return;
    actor.action = null;
    actor.vx = 0;
    actor.vy = 0;
  }

  function canUseMedicAdrenaline(actor, now) {
    return matchStarted &&
      isMedic(actor) &&
      !actor.action &&
      !actor.escaped &&
      (actor.state === "healthy" || actor.state === "injured") &&
      getMedicAdrenalineCooldownLeft(actor, now) <= 0;
  }

  function useMedicAdrenaline(actor, now) {
    if (!canUseMedicAdrenaline(actor, now)) return false;
    actor.medicAdrenalineUntil = now + MEDIC_ADRENALINE_DURATION;
    actor.medicAdrenalinePendingDamage = 0;
    actor.nextMedicAdrenalineAt = now + MEDIC_ADRENALINE_COOLDOWN;
    showAssistAlert("肾上腺素", now, 900);
    return true;
  }

  function canStartFencerLunge(actor, now) {
    return matchStarted &&
      isFencer(actor) &&
      !actor.action &&
      !actor.escaped &&
      (actor.state === "healthy" || actor.state === "injured") &&
      getFencerLungeCooldownLeft(actor, now) <= 0;
  }

  function startFencerLunge(actor, now) {
    if (!canStartFencerLunge(actor, now)) return false;
    actor.fencerLungePreparing = false;
    actor.fencerLungePreparingAt = 0;
    actor.action = {
      kind: "fencerLunge",
      start: now,
      until: now + FENCER_LUNGE_DURATION,
      lastUpdate: now,
      angle: actor.angle || 0,
      distance: 0,
      turned: false,
      hitHunter: false
    };
    actor.nextFencerLungeAt = now + FENCER_LUNGE_COOLDOWN;
    actor.fencerLastSprintAngle = null;
    showAssistAlert("突刺", now, 900);
    return true;
  }

  function prepareFencerLunge(actor, now) {
    if (!canStartFencerLunge(actor, now)) return false;
    actor.fencerLungePreparing = true;
    actor.fencerLungePreparingAt = now;
    showAssistAlert("突刺准备", now, 650);
    return true;
  }

  function releaseFencerLunge(actor, now) {
    if (!actor || !actor.fencerLungePreparing) return false;
    actor.fencerLungePreparing = false;
    actor.fencerLungePreparingAt = 0;
    return startFencerLunge(actor, now);
  }

  function cancelFencerLungePreparation(actor) {
    if (!actor) return;
    actor.fencerLungePreparing = false;
    actor.fencerLungePreparingAt = 0;
  }

  function getFighterPunchCooldownLeft(actor, now = performance.now()) {
    return Math.max(0, (actor && actor.nextFighterPunchAt || 0) - now);
  }

  function getFighterPunchRange() {
    return Math.max(0, hunter.attackRange || getHunterCharacter().attackRange || 0);
  }

  function isFighterArenaActive() {
    return Boolean(fighterArena && fighterArena.fighter && !fighterArena.fighter.escaped);
  }

  function isFighterArenaPreparing(now = performance.now()) {
    return isFighterArenaActive() && now < (fighterArena.prepareUntil || 0);
  }

  function isFighterArenaParticipant(actor) {
    return isFighterArenaActive() && (actor === hunter || actor === fighterArena.fighter);
  }

  function getFighterArenaStepCooldownLeft(actor, now = performance.now()) {
    return Math.max(0, (actor && actor.fighterArenaStepUntil || 0) - now);
  }

  function canUseFighterArenaStep(actor, now = performance.now()) {
    if (!isFighterArenaParticipant(actor) || isFighterArenaPreparing(now) || actor.action || getFighterArenaStepCooldownLeft(actor, now) > 0) return false;
    if (actor === hunter) return now >= (hunter.stunnedUntil || 0) && now >= (hunter.wipeUntil || 0);
    return !actor.escaped && (actor.state === "healthy" || actor.state === "injured");
  }

  function useFighterArenaStep(actor, now = performance.now()) {
    if (!canUseFighterArenaStep(actor, now)) return false;
    const beforeX = actor.x;
    const beforeY = actor.y;
    moveActorPhasing(actor, Math.cos(actor.angle || 0) * FIGHTER_ARENA_STEP_DISTANCE, Math.sin(actor.angle || 0) * FIGHTER_ARENA_STEP_DISTANCE);
    constrainFighterArenaParticipants();
    actor.vx = (actor.x - beforeX) / Math.max(FIGHTER_ARENA_STEP_RECOVERY / 1000, 0.001);
    actor.vy = (actor.y - beforeY) / Math.max(FIGHTER_ARENA_STEP_RECOVERY / 1000, 0.001);
    actor.fighterArenaStepUntil = now + FIGHTER_ARENA_STEP_RECOVERY;
    return true;
  }

  function canStartFighterArena(actor, now = performance.now()) {
    return matchStarted &&
      isFighter(actor) &&
      !isFighterArenaActive() &&
      !actor.fighterArenaUsed &&
      (actor.fighterPunchStunCount || 0) >= FIGHTER_PUNCH_STUNS_FOR_ARENA &&
      !actor.action &&
      !actor.escaped &&
      (actor.state === "healthy" || actor.state === "injured") &&
      now >= (actor.edictStunnedUntil || 0) &&
      now >= (actor.houndStunnedUntil || 0);
  }

  function findFighterArenaCenter(actor) {
    const blockedProps = repairPoints.concat(chairs, windows, pallets, exitGates);
    const allCandidates = getSpawnCandidates(32)
      .filter((point) => point.x > FIGHTER_ARENA_RADIUS + 70 && point.y > FIGHTER_ARENA_RADIUS + 70 && point.x < world.width - FIGHTER_ARENA_RADIUS - 70 && point.y < world.height - FIGHTER_ARENA_RADIUS - 70);
    const separatedCandidates = allCandidates
      .filter((point) => getSurvivors().every((survivor) => survivor === actor || survivor.escaped || distanceBetween(point, survivor) > FIGHTER_ARENA_RADIUS + 72));
    const candidates = separatedCandidates.length > 0 ? separatedCandidates : allCandidates;
    const centerFallback = {
      x: actorClamp(world.width * 0.5, FIGHTER_ARENA_RADIUS + 70, world.width - FIGHTER_ARENA_RADIUS - 70),
      y: actorClamp(world.height * 0.5, FIGHTER_ARENA_RADIUS + 70, world.height - FIGHTER_ARENA_RADIUS - 70)
    };
    return candidates.sort((a, b) => {
      const score = (point) => Math.min(...blockedProps.map((item) => distanceBetween(point, item)));
      return score(b) - score(a);
    })[0] || centerFallback;
  }

  function startFighterArena(actor, now = performance.now()) {
    if (!canStartFighterArena(actor, now)) return false;
    const center = findFighterArenaCenter(actor);
    if (!center) {
      showAssistAlert("没有可用擂台空地", now, 900);
      return false;
    }
    const fighterOrigin = { x: actor.x, y: actor.y, angle: actor.angle };
    const hunterOrigin = { x: hunter.x, y: hunter.y, angle: hunter.angle };
    dropCarriedSurvivorFromControl(now);
    hunter.action = null;
    hunter.vx = 0;
    hunter.vy = 0;
    hunter.fighterArenaStepUntil = 0;
    actor.action = null;
    actor.vx = 0;
    actor.vy = 0;
    actor.fighterArenaStepUntil = 0;
    actor.fighterArenaUsed = true;
    fighterArena = {
      fighter: actor,
      x: center.x,
      y: center.y,
      radius: FIGHTER_ARENA_RADIUS,
      hunterHealth: FIGHTER_ARENA_HUNTER_HEALTH,
      fighterHealth: FIGHTER_ARENA_HUNTER_HEALTH,
      prepareUntil: now + 2000,
      endsAt: now + FIGHTER_ARENA_MAX_DURATION,
      fighterOrigin,
      hunterOrigin
    };
    actor.x = center.x - FIGHTER_ARENA_RADIUS * 0.42;
    actor.y = center.y;
    actor.angle = 0;
    hunter.x = center.x + FIGHTER_ARENA_RADIUS * 0.42;
    hunter.y = center.y;
    hunter.angle = Math.PI;
    hunter.target = actor;
    hunter.targetLock = actor;
    hunter.targetLockUntil = now + 600000;
    showAssistAlert("擂台展开 · 双方准备2秒", now, 1200);
    return true;
  }

  function finishFighterArena(result, now = performance.now()) {
    if (!isFighterArenaActive()) return;
    const arena = fighterArena;
    const fighter = arena.fighter;
    fighterArena = null;
    fighter.action = null;
    fighter.path = [];
    fighter.pathGoal = null;
    hunter.action = null;
    hunter.path = [];
    hunter.pathGoal = null;

    const fighterReturn = findNearestSafePosition(arena.fighterOrigin.x, arena.fighterOrigin.y, fighter.radius);
    const hunterReturn = findNearestSafePosition(arena.hunterOrigin.x, arena.hunterOrigin.y, hunter.radius);
    fighter.x = fighterReturn.x;
    fighter.y = fighterReturn.y;
    fighter.angle = arena.fighterOrigin.angle;
    fighter.vx = 0;
    fighter.vy = 0;
    hunter.x = hunterReturn.x;
    hunter.y = hunterReturn.y;
    hunter.angle = arena.hunterOrigin.angle;
    hunter.vx = 0;
    hunter.vy = 0;
    hunter.targetLock = null;
    hunter.targetLockUntil = 0;

    if (result === "hunterDefeated") {
      hunter.fighterArenaStunUntil = now + FIGHTER_ARENA_HUNTER_STUN;
      hunter.stunnedUntil = Math.max(hunter.stunnedUntil || 0, hunter.fighterArenaStunUntil);
      hunter.status = "stunned";
      showAssistAlert("擂台胜利 · 追捕者眩晕2秒", now, 1200);
      return;
    }

    const timeout = result === "timeExpired";
    applySurvivorDamage(fighter, now, timeout ? 0.5 : 1);
    showAssistAlert(timeout ? "擂台时间结束 · 裂伤50" : "擂台落败 · 扣除1点生命", now, 1100);
  }

  function constrainFighterArenaParticipants() {
    if (!isFighterArenaActive()) return;
    [fighterArena.fighter, hunter].forEach((actor) => {
      const dx = actor.x - fighterArena.x;
      const dy = actor.y - fighterArena.y;
      const distance = Math.hypot(dx, dy);
      const limit = fighterArena.radius - actor.radius - 4;
      if (distance <= limit || distance < 0.001) return;
      actor.x = fighterArena.x + dx / distance * limit;
      actor.y = fighterArena.y + dy / distance * limit;
      actor.vx = 0;
      actor.vy = 0;
    });
  }

  function updateFighterArenaTimer(now) {
    if (isFighterArenaActive() && now >= (fighterArena.endsAt || 0)) finishFighterArena("timeExpired", now);
  }

  function canUseFighterPunch(actor, now = performance.now()) {
    return matchStarted &&
      isFighter(actor) &&
      !actor.action &&
      !actor.escaped &&
      (actor.state === "healthy" || actor.state === "injured") &&
      !isFighterArenaPreparing(now) &&
      getFighterArenaStepCooldownLeft(actor, now) <= 0 &&
      (isFighterArenaParticipant(actor) || getFighterPunchCooldownLeft(actor, now) <= 0);
  }

  function startFighterPunch(actor, now = performance.now()) {
    if (!canUseFighterPunch(actor, now)) return false;
    const windup = getHunterAttackWindupDuration();
    actor.action = {
      kind: "fighterPunch",
      start: now,
      hitAt: now + windup,
      until: now + FIGHTER_PUNCH_DURATION,
      angle: actor.angle || 0,
      resolved: false,
      hitHunter: false,
      arena: isFighterArenaParticipant(actor)
    };
    actor.vx = 0;
    actor.vy = 0;
    showAssistAlert("破缚拳蓄力", now, 650);
    return true;
  }

  function canStartFlywheel(actor, now) {
    return matchStarted &&
      hasSurvivorBadge(actor, "flywheel") &&
      !isFighterArenaParticipant(actor) &&
      !actor.action &&
      !actor.escaped &&
      (actor.state === "healthy" || actor.state === "injured") &&
      getFlywheelCooldownLeft(actor, now) <= 0;
  }

  function startFlywheel(actor, now) {
    if (!canStartFlywheel(actor, now)) return false;
    actor.action = {
      kind: "flywheelDash",
      start: now,
      until: now + FLYWHEEL_DURATION,
      lastUpdate: now,
      angle: actor.angle || 0,
      distance: 0
    };
    actor.nextFlywheelAt = now + FLYWHEEL_COOLDOWN;
    showAssistAlert("飞轮效应", now, 850);
    return true;
  }

  function turnFencerLunge(actor, direction) {
    const action = actor && actor.action;
    if (!action || action.kind !== "fencerLunge" || action.turned) return false;
    action.angle += direction * FENCER_LUNGE_TURN_ANGLE;
    action.turned = true;
    actor.angle = action.angle;
    showAssistAlert(direction < 0 ? "左变向" : "右变向", performance.now(), 650);
    return true;
  }

  function getPackageCooldownLeft(actor, now) {
    return Math.max(0, (actor.nextPackageAt || 0) - now);
  }

  function getTimeRewindCooldownLeft(actor, now) {
    return Math.max(0, (actor.nextTimeRewindAt || 0) - now);
  }

  function getMagicShowCooldownLeft(actor, now) {
    return Math.max(0, (actor.nextMagicShowAt || 0) - now);
  }

  function getRescuePhantomCooldownLeft(actor, now = performance.now()) {
    return Math.max(0, (actor && actor.nextRescuePhantomAt || 0) - now);
  }

  function getPerfumeCooldownLeft(actor, now) {
    return Math.max(0, (actor.nextPerfumeMistAt || 0) - now);
  }

  function getTunerEchoCooldownLeft(actor, now) {
    return Math.max(0, (actor.nextTunerEchoAt || 0) - now);
  }

  function getTunerCipherTuneCooldownLeft(actor, now) {
    return Math.max(0, (actor.nextTunerCipherTuneAt || 0) - now);
  }

  function getTunerResonance(actor) {
    return Math.max(0, Math.min(TUNER_RESONANCE_MAX, Number(actor && actor.tunerResonance) || 0));
  }

  function addTunerResonance(actor, amount) {
    if (!isTuner(actor) || !amount) return 0;
    const before = getTunerResonance(actor);
    actor.tunerResonance = Math.min(TUNER_RESONANCE_MAX, before + amount);
    return actor.tunerResonance - before;
  }

  function canUseTunerCipherTune(actor, now = performance.now()) {
    const action = actor && actor.action;
    const point = action && action.point;
    return Boolean(
      matchStarted &&
      isTuner(actor) &&
      action &&
      action.kind === "repairing" &&
      !action.calibration &&
      point &&
      !point.completed &&
      getTunerResonance(actor) >= 20 &&
      now >= (actor.nextTunerCipherTuneAt || 0)
    );
  }

  function useTunerCipherTune(actor, now) {
    if (!canUseTunerCipherTune(actor, now)) return false;
    const point = actor.action.point;
    actor.tunerResonance = getTunerResonance(actor) - 20;
    actor.nextTunerCipherTuneAt = now + TUNER_CIPHER_TUNE_COOLDOWN;
    point.progress = Math.min(1, point.progress + 0.1);
    actor.action.calibrationFeedback = { label: "谐振校正 +10%", color: "#bca4eb", until: now + 1200 };
    showAssistAlert("谐振校正 +10%", now, 900);
    if (point.progress >= 1) finishRepair(point);
    return true;
  }

  function canUseTunerEcho(actor, now) {
    return Boolean(
      matchStarted &&
      isTuner(actor) &&
      (actor.state === "healthy" || actor.state === "injured") &&
      !actor.action &&
      !actor.escaped &&
      getTunerResonance(actor) >= TUNER_ECHO_COST &&
      now >= (actor.nextTunerEchoAt || 0)
    );
  }

  function useTunerEcho(actor, now) {
    if (!canUseTunerEcho(actor, now)) return false;
    const angle = actor.angle || 0;
    const direction = { x: Math.cos(angle), y: Math.sin(angle) };
    const start = findNearestSafePosition(
      actor.x - direction.x * 18,
      actor.y - direction.y * 18,
      actor.radius
    );
    tunerEchoLines.push({
      owner: actor,
      x1: start.x,
      y1: start.y,
      x2: start.x - direction.x * TUNER_ECHO_LENGTH,
      y2: start.y - direction.y * TUNER_ECHO_LENGTH,
      until: now + TUNER_ECHO_DURATION
    });
    actor.tunerResonance = getTunerResonance(actor) - TUNER_ECHO_COST;
    actor.nextTunerEchoAt = now + TUNER_ECHO_COOLDOWN;
    showAssistAlert("回声带", now, 800);
    return true;
  }

  function canUsePerfumeMist(actor, now) {
    return Boolean(
      isPerfumer(actor) &&
      (actor.state === "healthy" || actor.state === "injured") &&
      !actor.action &&
      !actor.escaped &&
      now >= (actor.nextPerfumeMistAt || 0)
    );
  }

  function hasPerfumeUltimate(actor) {
    return (actor.perfumeUltimateCharges || 0) >= PERFUME_ULTIMATE_CHARGES;
  }

  function canThrowPackage(actor, now) {
    return matchStarted &&
      isMessenger(actor) &&
      actor.state !== "downed" &&
      actor.state !== "seated" &&
      actor.state !== "carried" &&
      actor.state !== "eliminated" &&
      !actor.action &&
      !actor.escaped &&
      now >= (actor.nextPackageAt || 0);
  }

  function canPlaceTimeDevice(actor, now) {
    return matchStarted &&
      isClockmaker(actor) &&
      (actor.state === "healthy" || actor.state === "injured") &&
      !actor.action &&
      !actor.escaped &&
      !actor.timeDevice &&
      now >= (actor.nextTimeRewindAt || 0);
  }

  function canUseMagicShow(actor, now) {
    return matchStarted &&
      isActor(actor) &&
      (actor.state === "healthy" || actor.state === "injured") &&
      !actor.action &&
      !actor.escaped &&
      now >= (actor.nextMagicShowAt || 0);
  }

  function canUseActorRescuePhantom(actor, now = performance.now()) {
    return matchStarted &&
      isActor(actor) &&
      (actor.state === "healthy" || actor.state === "injured") &&
      !actor.action &&
      !actor.escaped &&
      !actorDecoys.some((decoy) => decoy.kind === "actorRescuePhantom" && decoy.owner === actor) &&
      now >= (actor.nextRescuePhantomAt || 0);
  }

  function canActivateTimeRewind(actor, now) {
    return matchStarted &&
      isClockmaker(actor) &&
      actor.timeDevice &&
      now <= actor.timeDevice.until &&
      !actor.escaped &&
      actor.state !== "seated" &&
      actor.state !== "carried" &&
      actor.state !== "eliminated";
  }

  function canPlaceStitchPack(actor) {
    return matchStarted &&
      isApprentice(actor) &&
      actor.state !== "downed" &&
      actor.state !== "seated" &&
      actor.state !== "carried" &&
      actor.state !== "eliminated" &&
      !actor.action &&
      !actor.escaped &&
      getStitchPackCooldownLeft(actor) <= 0;
  }

  function getStitchPackCooldownLeft(actor, now = performance.now()) {
    return Math.max(0, (actor && actor.nextStitchPackAt || 0) - now);
  }

  function canPlaceSoulLamp(now) {
    return matchStarted &&
      selectedRole === PLAYER_ROLE.hunter &&
      isLanternKeeper() &&
      !hunter.action &&
      !hunter.carrying &&
      now >= hunter.stunnedUntil &&
      now >= hunter.wipeUntil &&
      now >= nextSoulLampAt &&
      soulLamps.length < getSoulLampLimit();
  }

  function canUseGhostfire(now) {
    return matchStarted &&
      isLanternKeeper() &&
      soulLamps.length > 0 &&
      !hunter.action &&
      !hunter.carrying &&
      now >= hunter.stunnedUntil &&
      now >= hunter.wipeUntil &&
      now >= (hunter.nextGhostfireAt || 0);
  }

  function getGhostfireCooldownLeft(now = performance.now()) {
    return Math.max(0, (hunter.nextGhostfireAt || 0) - now);
  }

  function useGhostfire(now) {
    if (!canUseGhostfire(now)) return false;
    hunter.nextGhostfireAt = now + GHOSTFIRE_COOLDOWN;
    soulLamps.forEach((lamp) => {
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([x, y]) => {
        ghostfireProjectiles.push({
          x: lamp.x + x * GHOSTFIRE_RADIUS,
          y: lamp.y + y * GHOSTFIRE_RADIUS,
          vx: x * GHOSTFIRE_SPEED,
          vy: y * GHOSTFIRE_SPEED,
          traveled: 0
        });
      });
    });
    trackHunterSkillUseUnlock(now);
    lanternAlert = { text: "鬼火吞噬", until: now + 1000 };
    chasePulseUntil = now + 360;
    return true;
  }

  function canShadowTeleport(now) {
    return matchStarted &&
      selectedRole === PLAYER_ROLE.hunter &&
      isLanternKeeper() &&
      hunter.presenceTier >= 1 &&
      soulLamps.length > 0 &&
      !hunter.action &&
      !hunter.carrying &&
      now >= hunter.stunnedUntil &&
      now >= hunter.wipeUntil &&
      !isHunterDisplacementBlocked(now) &&
      now >= (hunter.nextShadowTeleportAt || 0);
  }

  function canUseShortSaw(now) {
    return isSawbone() &&
      hunter.presenceTier >= 1 &&
      now < (hunter.shortSawAvailableUntil || 0);
  }

  function canStartSawDash(now) {
    return matchStarted &&
      isSawbone() &&
      !hunter.action &&
      !hunter.carrying &&
      now >= hunter.stunnedUntil &&
      now >= hunter.wipeUntil &&
      !isHunterDisplacementBlocked(now) &&
      (isInfiniteSawboneMode() || canUseShortSaw(now) || now >= (hunter.nextSawDashAt || 0));
  }

  function resize() {
    dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (miniMap && miniCtx) {
      const miniBox = miniMap.getBoundingClientRect();
      miniMap.width = Math.floor(miniBox.width * dpr);
      miniMap.height = Math.floor(miniBox.height * dpr);
      miniCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  function keyToInput(key, value) {
    const code = key.toLowerCase();
    const arenaActor = selectedRole === PLAYER_ROLE.hunter ? hunter : player;
    if (isFighterArenaParticipant(arenaActor)) {
      if (value && code === "r") {
        restartCurrentMatch();
        return;
      }
      if (code === ATTACK_KEY) {
        const now = performance.now();
        if (selectedRole === PLAYER_ROLE.hunter) {
          if (value) startHunterAttackPress(now);
          else releaseHunterAttackPress(now);
        } else if (value) {
          startFighterPunch(player, now);
        }
      }
      if (value && code === SKILL_KEY) useFighterArenaStep(arenaActor, performance.now());
      if (code === "w" || key === "ArrowUp") input.up = value;
      if (code === "s" || key === "ArrowDown") input.down = value;
      if (code === "a" || key === "ArrowLeft") input.left = value;
      if (code === "d" || key === "ArrowRight") input.right = value;
      if (key === "Shift") input.sprint = value;
      return;
    }
    if (value && selectedRole === PLAYER_ROLE.hunter && hunter.trumpCardSelecting && /^[1-7]$/.test(key)) {
      if (selectTrumpCardAssist(key, performance.now())) return;
    }
    if (value && selectedRole === PLAYER_ROLE.hunter && code === "m") {
      if (startTrumpCardSelection(performance.now())) return;
    }
    if (value && selectedRole === PLAYER_ROLE.survivor && isAntiqueDealer(player) && /^[1-5]$/.test(key)) {
      if (startAntiqueFluteSkill(player, Number(key), performance.now())) return;
    }
    if (selectedRole === PLAYER_ROLE.hunter && isTwinSword()) {
      if (value && code === "t") toggleTwinTimeMode();
      if (value && code === "g") activateTwinDualCast(performance.now());
      if (code === "e") {
        if (hunter.twinForm === TWIN_FORM_QINGTIAN) {
          if (value) castTwinPrimaryInstant(performance.now());
        } else if (value) {
          startTwinAim("primary", performance.now());
        } else {
          finishTwinAim(performance.now());
        }
        return;
      }
      if (code === "r") {
        if (value) startTwinAim("secondary", performance.now());
        else finishTwinAim(performance.now());
        return;
      }
      if (code === SHADOW_KEY) {
        if (value) startTwinAim("sword", performance.now());
        else finishTwinAim(performance.now());
        return;
      }
    } else if (selectedRole === PLAYER_ROLE.hunter && isEdictor() && code === "e") {
      if (value) startEdictHookAim(performance.now());
      else finishEdictHookAim(performance.now());
      return;
    } else if (selectedRole === PLAYER_ROLE.hunter && isAbyss() && code === "e") {
      if (value) {
        if (isAbyssForm()) useAbyssProjection(performance.now());
        else startAbyssForm(performance.now());
      }
      return;
    } else if (code === "m" && selectedRole === PLAYER_ROLE.survivor && isActor(player)) {
      if (value) startActorRescuePhantomAim(player, performance.now());
      else finishActorRescuePhantomAim(performance.now());
      return;
    } else if (value && code === "r" && selectedRole) {
      restartCurrentMatch();
    }
    if (
      value &&
      selectedRole === PLAYER_ROLE.survivor &&
      player.action &&
      player.action.kind === "fencerLunge" &&
      (code === "a" || code === "d" || key === "ArrowLeft" || key === "ArrowRight")
    ) {
      turnFencerLunge(player, code === "a" || key === "ArrowLeft" ? -1 : 1);
    }
    if (value && key === " ") handlePlayerInteraction(performance.now());
    if (value && code === "e") handlePlayerUse(performance.now());
    if (code === "l" && (value || selectedRole === PLAYER_ROLE.survivor)) {
      const now = performance.now();
      if (selectedRole === PLAYER_ROLE.survivor) {
        if (!value) startFlywheel(player, now);
      } else {
        handleHunterAssist(now);
      }
    }
    if (code === ATTACK_KEY && selectedRole === PLAYER_ROLE.hunter) {
      const now = performance.now();
      if (value) startHunterAttackPress(now);
      else releaseHunterAttackPress(now);
    }
    if (value && code === ATTACK_KEY && selectedRole === PLAYER_ROLE.survivor && isFighter(player)) {
      startFighterPunch(player, performance.now());
    }
    if (value && code === SHADOW_KEY) handlePlayerShadowSkill(performance.now());
    if (code === SKILL_KEY) {
      if (selectedRole === PLAYER_ROLE.survivor && isAntiqueDealer(player)) {
        if (value) toggleAntiqueFlute(player, performance.now());
      } else if (selectedRole === PLAYER_ROLE.survivor && isFighter(player)) {
        if (value) startFighterArena(player, performance.now());
      } else if (selectedRole === PLAYER_ROLE.survivor && isFencer(player)) {
        if (value) prepareFencerLunge(player, performance.now());
        else releaseFencerLunge(player, performance.now());
      } else if (selectedRole === PLAYER_ROLE.survivor && isMessenger(player)) {
        if (value) startPackageAim(player, performance.now());
        else finishPackageAim(performance.now());
      } else if (selectedRole === PLAYER_ROLE.survivor && isNavigator(player)) {
        if (value) startNavigationChannelAim(player, performance.now());
        else finishNavigationChannelAim(performance.now());
      } else if (selectedRole === PLAYER_ROLE.survivor && isApprentice(player)) {
        if (value) handlePlayerSkill(performance.now());
      } else if (selectedRole === PLAYER_ROLE.hunter && isHammerer()) {
        if (value) startHammerShock(performance.now());
        else releaseHammerShock(performance.now());
      } else if (selectedRole === PLAYER_ROLE.hunter && isSawbone()) {
        if (value) handlePlayerSkill(performance.now());
      } else if (selectedRole === PLAYER_ROLE.hunter && isDancer()) {
        if (value) startDancePointAim(performance.now());
        else finishDancePointAim(performance.now());
      } else if (selectedRole === PLAYER_ROLE.hunter && isAbyss()) {
        if (value) startAbyssTentacleAim(performance.now());
        else finishAbyssTentacleAim(performance.now());
      } else if (selectedRole === PLAYER_ROLE.hunter && isTwinSword()) {
        if (value) handlePlayerSkill(performance.now());
      } else if (value) {
        handlePlayerSkill(performance.now());
      }
    }
    const direction = code === "w" || key === "ArrowUp" ? "up" : code === "s" || key === "ArrowDown" ? "down" : code === "a" || key === "ArrowLeft" ? "left" : code === "d" || key === "ArrowRight" ? "right" : "";
    if (direction) {
      const keyId = key.toLowerCase();
      if (value) {
        input.directionKeyMap[keyId] = direction;
        input[direction] = true;
      } else {
        const mapped = input.directionKeyMap[keyId] || direction;
        input[mapped] = false;
        delete input.directionKeyMap[keyId];
      }
    }
    if (key === "Shift") input.sprint = value;
  }

  function getMoveVector() {
    let x = 0;
    let y = 0;
    if (input.left) x -= 1;
    if (input.right) x += 1;
    if (input.up) y -= 1;
    if (input.down) y += 1;
    x += input.touchX;
    y += input.touchY;
    if (selectedRole === PLAYER_ROLE.survivor && performance.now() < (player.abyssConfusedUntil || 0)) {
      x *= -1;
      y *= -1;
    }

    const length = Math.hypot(x, y);
    if (length > 1) {
      x /= length;
      y /= length;
    }
    return { x, y, length };
  }

  function circleHitsRect(cx, cy, radius, box) {
    const closestX = Math.max(box.x, Math.min(cx, box.x + box.w));
    const closestY = Math.max(box.y, Math.min(cy, box.y + box.h));
    return Math.hypot(cx - closestX, cy - closestY) < radius;
  }

  function distanceToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSq = dx * dx + dy * dy;
    if (lengthSq < 0.001) return Math.hypot(px - x1, py - y1);
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSq));
    return Math.hypot(px - (x1 + dx * t), py - (y1 + dy * t));
  }

  function circleHitsSegment(cx, cy, radius, segment) {
    return distanceToSegment(cx, cy, segment.x1, segment.y1, segment.x2, segment.y2) < radius;
  }

  function collides(x, y, radius = player.radius) {
    return getCollisionRects().some((wall) => circleHitsRect(x, y, radius, wall));
  }

  function actorCollides(actor, x, y, radius = actor.radius) {
    if (collides(x, y, radius)) return true;
    if (actorBlockedByRescuePhantom(actor, x, y, radius)) return true;
    return actorBlockedByMirrorCurtain(actor, x, y, radius);
  }

  function actorBlockedByRescuePhantom(actor, x, y, radius = actor.radius) {
    return actorDecoys.some((phantom) => {
      if (phantom.kind !== "actorRescuePhantom" || phantom === actor) return false;
      return Math.hypot(x - phantom.x, y - phantom.y) < radius + phantom.radius;
    });
  }

  function actorBlockedByMirrorCurtain(actor, x, y, radius = actor.radius) {
    if (!actor || actor === hunter || actor.kind !== "ai" && actor !== player) return false;
    return mirrorCurtains.some((curtain) => circleHitsSegment(x, y, radius + MIRROR_CURTAIN_THICKNESS * 0.5, curtain));
  }

  function getCollisionRects() {
    if (collisionRectsCache) return collisionRectsCache;
    const droppedPallets = pallets
      .filter((pallet) => pallet.label === "dropped")
      .map((pallet) => ({ ...getPalletCollisionRect(pallet), blinkPhaseable: true }));
    const windowFrames = windows.map((windowItem) => ({ ...getWindowCollisionRect(windowItem), blinkPhaseable: true }));
    collisionRectsCache = walls.concat(droppedPallets, windowFrames);
    return collisionRectsCache;
  }

  function invalidateCollisionRects() {
    collisionRectsCache = null;
  }

  function getWindowCollisionRect(windowItem) {
    return rect(
      windowItem.x - windowItem.w / 2,
      windowItem.y - windowItem.h / 2,
      windowItem.w,
      windowItem.h
    );
  }

  function getPalletCollisionRect(pallet) {
    const width = Math.max(34, pallet.w - 28);
    const thickness = 10;
    if (Math.abs(pallet.angle - Math.PI / 2) < 0.1) {
      return rect(pallet.x - thickness / 2, pallet.y - width / 2, thickness, width);
    }
    return rect(pallet.x - width / 2, pallet.y - thickness / 2, width, thickness);
  }

  function movePlayer(dt) {
    if (selectedRole === PLAYER_ROLE.hunter) {
      if (activePatroller) return moveControlledPatroller(dt, performance.now());
      return moveControlledHunter(dt);
    }
    return moveControlledSurvivor(dt);
  }

  function moveControlledPatroller(dt, now) {
    if (!activePatroller || now >= activePatroller.until) {
      activePatroller = null;
      return;
    }
    hunter.vx = 0;
    hunter.vy = 0;
    const move = getMoveVector();
    const dx = move.x * ASSIST_PATROLLER_SPEED * dt;
    const dy = move.y * ASSIST_PATROLLER_SPEED * dt;
    if (move.length > 0.1) activePatroller.angle = Math.atan2(move.y, move.x);
    moveActorSmart(activePatroller, dx, dy);
  }

  function moveControlledSurvivor(dt) {
    if (player.escaped) {
      player.vx = 0;
      player.vy = 0;
      return;
    }

    const now = performance.now();
    if (now < (player.edictStunnedUntil || 0) || now < (player.houndStunnedUntil || 0) || now < (player.abyssStaggerUntil || 0)) {
      player.vx = 0;
      player.vy = 0;
      return;
    }
    if (isFighterArenaPreparing(now) && isFighterArenaParticipant(player)) {
      player.vx = 0;
      player.vy = 0;
      return;
    }
    const move = getMoveVector();
    if (shouldCancelActionOnMove(player, move)) {
      cancelActionFromMovement(player);
    }

    if (updateActorAction(player, now)) return;

    if (player.state === "downed") {
      if (isBeingPickedUp(player)) {
        player.vx = 0;
        player.vy = 0;
        return;
      }
      const crawlSpeed = getDownedCrawlSpeed(player);
      const dx = move.x * crawlSpeed * dt;
      const dy = move.y * crawlSpeed * dt;
      if (move.length > 0.1) player.angle = Math.atan2(move.y, move.x);
      moveActor(player, dx, dy);
      player.vx = dx / Math.max(dt, 0.001);
      player.vy = dy / Math.max(dt, 0.001);
      return;
    }

    if (player.state !== "healthy" && player.state !== "injured") {
      player.vx = 0;
      player.vy = 0;
      return;
    }

    const wantsSprint = input.sprint && player.stamina > 2 && move.length > 0.1;
    maybeAddFencerStrideMark(player, move, now);
    const injuredPenalty = player.state === "injured" ? 0.88 : 1;
    const hitBoost = now < player.boostUntil ? 1.45 : 1;
    const speed = (wantsSprint ? player.sprintSpeed : player.speed) * injuredPenalty * hitBoost * getSurvivorMoveSpeedMultiplier(player, now, move);
    const dx = move.x * speed * dt;
    const dy = move.y * speed * dt;

    if (move.length > 0.1) {
      player.angle = Math.atan2(move.y, move.x);
    }

    moveActor(player, dx, dy);

    if (wantsSprint) {
      player.stamina = Math.max(0, player.stamina - 29 * dt);
    } else {
      player.stamina = Math.min(100, player.stamina + 22 * dt);
    }

    player.vx = dx / Math.max(dt, 0.001);
    player.vy = dy / Math.max(dt, 0.001);
  }

  function moveControlledHunter(dt) {
    const now = performance.now();
    if (isFighterArenaPreparing(now) && isFighterArenaParticipant(hunter)) {
      hunter.vx = 0;
      hunter.vy = 0;
      return;
    }
    if (updateActorAction(hunter, now)) return;

    if (now < hunter.stunnedUntil) {
      hunter.status = "stunned";
      hunter.vx = 0;
      hunter.vy = 0;
      return;
    }

    if (now < hunter.wipeUntil) {
      hunter.status = hunter.lastAttackHit ? "wipe" : "miss";
      hunter.vx = 0;
      hunter.vy = 0;
      return;
    }

    updateCarriedSurvivorPosition();

    const move = getMoveVector();
    const speed = getHunterMoveSpeed() * getHunterCarrySpeedMultiplier();
    const dx = move.x * speed * dt;
    const dy = move.y * speed * dt;
    const beforeX = hunter.x;
    const beforeY = hunter.y;

    if (move.length > 0.1) hunter.angle = Math.atan2(move.y, move.x);
    moveActor(hunter, dx, dy);
    hunter.vx = (hunter.x - beforeX) / Math.max(dt, 0.001);
    hunter.vy = (hunter.y - beforeY) / Math.max(dt, 0.001);
    hunter.target = chooseHunterTarget();
    hunter.status = hunter.carrying ? "carrying" : hunter.target ? "controlled" : "allDowned";
  }

  function updateTeammates(dt, now) {
    if (now - lastAIUpdateAt < AI_UPDATE_INTERVAL) return;
    const aiDt = Math.min(0.07, Math.max(0.001, (now - lastAIUpdateAt) / 1000));
    lastAIUpdateAt = now;
    const aiSurvivors = selectedRole === PLAYER_ROLE.hunter ? getSurvivors() : teammates;
    updateAITeamPlan(aiSurvivors, now);
    updateAIFinalCipherGuard(aiSurvivors, now);
    aiSurvivors.forEach((survivor) => updateAISurvivor(survivor, aiDt, now));
  }

  function updateAITeamPlan(aiSurvivors, now) {
    const seated = getSurvivors().filter((survivor) => survivor.state === "seated" && survivor.chair);
    const rescuePlanValid = aiTeamPlan.rescuer === null ||
      !isAIQuickChatRescueClaimActive(aiTeamPlan.rescuer, now) &&
      isValidAIRescuePlannerActor(aiTeamPlan.rescuer, seated);
    const gatePlanValid = aiTeamPlan.gateOpener === null || isValidAITeamPlannerActor(aiTeamPlan.gateOpener);
    if (now < aiTeamPlan.until && rescuePlanValid && gatePlanValid) return;
    const available = aiSurvivors.filter((survivor) => {
      return isValidAITeamPlannerActor(survivor) && !isAIQuickChatRescueClaimActive(survivor, now);
    });
    let rescuer = seated.length && rescuePlanValid ? aiTeamPlan.rescuer : null;
    if (seated.length && available.length) {
      if (!rescuer) {
        rescuer = available.slice().sort((a, b) => {
          const roleOrder = Number(!isRescueRoleSurvivor(a)) - Number(!isRescueRoleSurvivor(b));
          if (roleOrder !== 0) return roleOrder;
          const aTarget = getAIChairRescueTarget(a) || seated[0];
          const bTarget = getAIChairRescueTarget(b) || seated[0];
          return distanceBetween(a, aTarget.chair) - distanceBetween(b, bTarget.chair);
        })[0] || null;
      }
    }

    let gateOpener = null;
    if (areExitsPowered() && !exitGates.some((gate) => gate.opened)) {
      gateOpener = available
        .filter((survivor) => survivor !== rescuer)
        .sort((a, b) => getAIGateOpenerScore(a) - getAIGateOpenerScore(b))[0] || rescuer;
    }

    let repairLead = null;
    if (!areExitsPowered() && seated.length === 0) {
      repairLead = available.slice().sort((a, b) => getAIRepairLeadScore(a) - getAIRepairLeadScore(b))[0] || null;
    }

    aiTeamPlan = { until: now + AI_TEAM_PLAN_INTERVAL, rescuer, gateOpener, repairLead };
  }

  function isValidAITeamPlannerActor(survivor) {
    return Boolean(survivor && !survivor.escaped && (survivor.state === "healthy" || survivor.state === "injured") && survivor !== hunter.target);
  }

  function isValidAIRescuePlannerActor(survivor, seated) {
    if (!survivor || survivor.escaped || survivor.state !== "healthy" && survivor.state !== "injured") return false;
    return seated.some((target) => target.chair && distanceBetween(survivor, target.chair) <= AI_RESCUE_ASSIGNMENT_MAX_DISTANCE);
  }

  function getAIRepairLeadScore(survivor) {
    const character = getSurvivorCharacter(survivor);
    const repairRoleBonus = getSurvivorRoleLabel(survivor) === "修机位" ? 700 : 0;
    return (character.repairDuration || 1) * 520 - repairRoleBonus;
  }

  function getAIGateOpenerScore(survivor) {
    const roleBonus = getSurvivorRoleLabel(survivor) === "修机位" ? 130 : 0;
    return distanceToNearestGate(survivor) - roleBonus;
  }

  function updateAIFighterArena(survivor, dt, now) {
    if (!isFighterArenaParticipant(survivor)) return false;
    if (isFighterArenaPreparing(now)) {
      survivor.vx = 0;
      survivor.vy = 0;
      return true;
    }
    if (survivor.action) {
      updateActorAction(survivor, now);
      return true;
    }
    const dx = hunter.x - survivor.x;
    const dy = hunter.y - survivor.y;
    const distance = Math.hypot(dx, dy);
    survivor.angle = Math.atan2(dy, dx);
    const punchRange = getFighterPunchRange() + hunter.radius * 0.5;
    if (distance <= punchRange && canUseFighterPunch(survivor, now)) return startFighterPunch(survivor, now);
    if (distance > Math.max(punchRange * 1.65, FIGHTER_ARENA_STEP_DISTANCE * 1.25) && useFighterArenaStep(survivor, now)) return true;
    if (distance > punchRange * 0.8) moveActorToPoint(survivor, hunter.x, hunter.y, survivor.speed, dt, now);
    return true;
  }

  function maybeUseAIFighterArena(survivor, hunterDistance, now) {
    if (!isFighter(survivor) || !canStartFighterArena(survivor, now)) return false;
    if (hunter.carrying || hunterDistance > 650) return false;
    return startFighterArena(survivor, now);
  }

  function updateAISurvivor(survivor, dt, now) {
    if (survivor.escaped) return;
    if (survivor.state === "eliminated" || survivor.state === "seated" || survivor.state === "carried") return;
    if (now < (survivor.edictStunnedUntil || 0) || now < (survivor.houndStunnedUntil || 0) || now < (survivor.abyssStaggerUntil || 0)) {
      survivor.vx = 0;
      survivor.vy = 0;
      return;
    }
    if (updateAIFighterArena(survivor, dt, now)) return;
    const hunterVisible = canAISurvivorSeeHunter(now);
    const poolYinSensed = canAISurvivorSensePoolYin(survivor, now);
    const hunterDistance = hunterVisible || poolYinSensed ? distanceBetween(survivor, hunter) : Infinity;
    if (maybeUseAIFighterArena(survivor, hunterDistance, now)) return;
    if (survivor.state === "downed") {
      if (isBeingPickedUp(survivor)) {
        survivor.vx = 0;
        survivor.vy = 0;
        return;
      }
      if (survivor.action && updateActorAction(survivor, now)) return;
      if (maybeUseAIClockmakerSkill(survivor, hunterDistance, now)) return;
      if (updateAIDownedEscape(survivor, dt, now)) return;
      startSelfHealing(survivor, now);
      survivor.vx = 0;
      survivor.vy = 0;
      return;
    }
    if (isHatchOpen() && (survivor.state === "healthy" || survivor.state === "injured")) {
      if (survivor.action && survivor.action.kind === "escaping" && survivor.action.hatch) {
        updateActorAction(survivor, now);
        return;
      }
      cancelSurvivorAction(survivor);
      updateAIHatchObjective(survivor, dt, now);
      return;
    }
    if (survivor.action && survivor.action.kind === "beingHealed") {
      updateActorAction(survivor, now);
      return;
    }
    if (survivor.action && ["vaulting", "droppingPallet"].includes(survivor.action.kind)) {
      updateActorAction(survivor, now);
      return;
    }
    if (survivor.action && survivor.action.kind === "navigationChannelSlide") {
      updateActorAction(survivor, now);
      return;
    }
    if (survivor.action && survivor.action.kind === "fighterPunch") {
      updateActorAction(survivor, now);
      return;
    }
    if (maybeUseAIActorInterruptPhantom(survivor, now)) return;
    if (updateAIHitRecoveryRescue(survivor, dt, now)) return;
    if (maybeUseAIShieldGuard(survivor, hunterDistance, now)) return;
    if (updateAIFighterCarryRescue(survivor, dt, now)) return;
    if (hunter.target === survivor && hunterDistance <= AI_CLOSE_KITE_RANGE) {
      updateAICloseKite(survivor, dt, now, hunterDistance);
      return;
    }
    if (updateAINavigationChannelDirective(survivor, dt, now, hunterDistance)) return;
    if (updateAIQuickChatDirective(survivor, dt, now, hunterDistance)) return;
    if (updateAIMessengerCarryRescue(survivor, dt, now)) return;
    if (updateAIChairRescueAction(survivor, dt, now, hunterDistance)) return;
    if (updateAIPalletMindgame(survivor, dt, now, hunterDistance)) return;
    if (updateAIMessengerSupport(survivor, dt, now, hunterDistance)) return;
    if (maybeInterruptAIObjectiveForHunterThreat(survivor, hunterDistance, now)) {
      const chairTarget = getAIChairRescueTarget(survivor);
      if (isCommittedAIChairRescueRole(survivor, chairTarget) && updateAIChairRescue(survivor, dt, now, hunterDistance)) return;
      if (maybeUseAIActorSkill(survivor, hunterDistance, now)) return;
      handleAIInteraction(survivor, now, hunterDistance);
      moveAISurvivorAway(survivor, dt, now, hunterDistance);
      return;
    }
    if (maybeInterruptAIHealingForHunterThreat(survivor, hunterDistance, now)) {
      handleAIInteraction(survivor, now, hunterDistance);
      moveAISurvivorAway(survivor, dt, now, hunterDistance);
      return;
    }
    maybeInterruptAIObjectiveForRescue(survivor, now);
    if (survivor.action && survivor.action.kind === "escaping") {
      if (updateActorAction(survivor, now)) return;
    }
    if (shouldAIForcePopFinalCipher(survivor, hunterDistance) && updateAIRepair(survivor, dt, now)) return;
    if (exitGates.some((gate) => gate.opened) && isAISafeForEscapeObjective(survivor, hunterDistance)) {
      if (updateAIEscape(survivor, dt, now)) return;
    }
    if (hunterDistance < 580 && !shouldAIHoldFinalCipherAgainstHunter(survivor, now)) {
      if (updateAIChairRescue(survivor, dt, now, hunterDistance)) return;
      if (shouldAIRepairDuringDistantChase(survivor, hunterDistance) && updateAIRepair(survivor, dt, now)) return;
      if (maybeUseAIActorSkill(survivor, hunterDistance, now)) return;
      if (maybeUseAITunerEcho(survivor, hunterDistance, now)) return;
      if (maybeUseAIGeneralSkill(survivor, hunterDistance, now)) return;
      if (maybeUseAIFencerSkill(survivor, hunterDistance, now)) return;
      if (tryStartAIPalletMindgame(survivor, now, hunterDistance)) return;
      cancelSurvivorAction(survivor);
      handleAIInteraction(survivor, now, hunterDistance);
      moveAISurvivorAway(survivor, dt, now, hunterDistance);
      return;
    }
    if (maybeAvoidAIDancePoint(survivor, dt, now)) return;
    if (updateAISoulPatrolDismantle(survivor, dt, now, hunterDistance)) return;
    if (updateActorAction(survivor, now)) return;

    if (isKiteSimulatorMode() && survivor !== player) {
      if (updateAIObjective(survivor, dt, now, hunterDistance)) return;
      moveAISurvivorWander(survivor, dt, now);
      return;
    }

    if (maybeUseAISurvivorSkill(survivor, hunterDistance, now)) return;
    maybeThrowAIPackage(survivor, hunterDistance, now);
    if (maybeUseAIStitchPack(survivor, hunterDistance, now)) return;

    if (updateAIChairRescue(survivor, dt, now, hunterDistance)) return;
    if (updateAIDownedTeammateHealing(survivor, dt, now, hunterDistance)) return;
    if (updateAIFinalCipherGuardObjective(survivor, dt, now)) return;
    if (updateAIPeeperDismantle(survivor, dt, now, hunterDistance)) return;
    if (updateAISoulLampDismantle(survivor, dt, now, hunterDistance)) return;
    if (survivor.healDecision && updateAIHealing(survivor, dt, now, hunterDistance)) return;

    if (isAISafeForObjective(survivor, hunterDistance)) {
      if (updateAIObjective(survivor, dt, now, hunterDistance)) return;
    }

    if (updateAIHealing(survivor, dt, now, hunterDistance)) return;

    if (hunter.target !== survivor && updateAIObjective(survivor, dt, now, hunterDistance)) return;

    if (hunterDistance < 580) {
      handleAIInteraction(survivor, now, hunterDistance);
      moveAISurvivorAway(survivor, dt, now, hunterDistance);
      return;
    }

    if (updateAIObjective(survivor, dt, now, hunterDistance)) return;

    moveAISurvivorWander(survivor, dt, now);
  }

  function maybeInterruptAIObjectiveForHunterThreat(survivor, hunterDistance, now) {
    if (!survivor.action || !["repairing", "openingGate"].includes(survivor.action.kind)) return false;
    if (survivor.action.kind === "openingGate" && exitGates.some((gate) => gate.opened)) {
      cancelGateOpen(survivor.action);
      survivor.action = null;
      survivor.objectiveDecision = null;
      survivor.path = [];
      survivor.pathGoal = null;
      return false;
    }
    const abortRange = survivor.action.kind === "openingGate" ? AI_GATE_OPEN_ABORT_RANGE : AI_OBJECTIVE_ABORT_RANGE;
    if (hunterDistance > abortRange && !canAISurvivorSensePoolYin(survivor, now)) return false;

    if (survivor.action.kind === "repairing") cancelRepair(survivor.action);
    if (survivor.action.kind === "openingGate") cancelGateOpen(survivor.action);
    survivor.action = null;
    survivor.objectiveDecision = null;
    survivor.kiteDecision = null;
    survivor.wanderTarget = null;
    survivor.path = [];
    survivor.pathGoal = null;
    survivor.nextInteractAt = now + 450;
    return true;
  }

  function updateAICloseKite(survivor, dt, now, hunterDistance) {
    cancelSurvivorAction(survivor);
    survivor.objectiveDecision = null;
    survivor.healDecision = null;
    survivor.wanderTarget = null;
    const channel = getAINavigationChannelKiteTarget(survivor, hunterDistance);
    if (channel) {
      moveAISurvivorAway(survivor, dt, now, hunterDistance);
      return;
    }
    if (maybeUseAISurvivorSkill(survivor, hunterDistance, now)) return;
    if (tryStartAIPalletMindgame(survivor, now, hunterDistance)) return;
    handleAIInteraction(survivor, now, hunterDistance);
    moveAISurvivorAway(survivor, dt, now, hunterDistance);
  }

  function shouldAIHoldFinalCipherAgainstHunter(survivor, now) {
    const point = finalCipherGuard && finalCipherGuard.point;
    return Boolean(
      finalCipherGuard &&
      finalCipherGuard.survivor === survivor &&
      point &&
      shouldHoldFinalCipherPoint(point, now)
    );
  }

  function maybeAvoidAIDancePoint(survivor, dt, now) {
    if (!isDancer() || !pendingDancePoint || now >= pendingDancePoint.until) return false;
    if (survivor.state !== "healthy" && survivor.state !== "injured") return false;
    if (isAIDancePointRescueExempt(survivor)) return false;
    const distance = distanceBetween(survivor, pendingDancePoint);
    if (distance > AI_DANCE_POINT_AVOID_RANGE) return false;
    const away = normalizeVector(survivor.x - pendingDancePoint.x, survivor.y - pendingDancePoint.y);
    const direction = away.x || away.y ? away : normalizeVector(survivor.x - hunter.x, survivor.y - hunter.y);
    const tangent = { x: -direction.y, y: direction.x };
    const candidates = [
      { x: survivor.x + direction.x * 300, y: survivor.y + direction.y * 300 },
      { x: survivor.x + direction.x * 230 + tangent.x * 150, y: survivor.y + direction.y * 230 + tangent.y * 150 },
      { x: survivor.x + direction.x * 230 - tangent.x * 150, y: survivor.y + direction.y * 230 - tangent.y * 150 }
    ];
    const destination = candidates.find((point) => isSafePosition(point.x, point.y, survivor.radius)) ||
      findNearestSafePosition(survivor.x + direction.x * 180, survivor.y + direction.y * 180, survivor.radius);
    cancelSurvivorAction(survivor);
    survivor.kiteDecision = null;
    survivor.healDecision = null;
    survivor.objectiveDecision = null;
    survivor.wanderTarget = null;
    survivor.path = [];
    survivor.pathGoal = null;
    const moved = moveActorToPoint(survivor, destination.x, destination.y, survivor.speed * 0.94, dt, now);
    if (moved < 0.5 && now > survivor.repathAt - 120) {
      survivor.path = [];
      survivor.pathGoal = null;
      survivor.repathAt = 0;
      const fallback = getAIReachableUnstuckPoint(survivor, pendingDancePoint);
      if (fallback) moveActorToPoint(survivor, fallback.x, fallback.y, survivor.speed * 0.94, dt, now);
    }
    return true;
  }

  function isAIDancePointRescueExempt(survivor) {
    if (survivor.action && survivor.action.kind === "rescuing") return true;
    if (!isPreferredAIChairRescuer(survivor)) return false;
    const target = getAIChairRescueTarget(survivor);
    return Boolean(target && isAISafeToRescueChair(survivor, distanceBetween(survivor, hunter), target));
  }

  function maybeThrowAIPackage(survivor, hunterDistance, now) {
    if (!canThrowPackage(survivor, now)) return false;
    const pressured = hunter.target === survivor && hunterDistance < 460;
    const rescueCarry = Boolean(hunter.carrying) && hunterDistance < 520;
    if (!pressured && !rescueCarry) return false;
    if (!hasWalkableLine(survivor.x, survivor.y, hunter.x, hunter.y, PACKAGE_RADIUS)) return false;
    throwPackage(survivor, Math.atan2(hunter.y - survivor.y, hunter.x - survivor.x), now);
    return true;
  }

  function getAIMessengerSupportValue(target) {
    if (!target) return 0;
    let value = 1;
    if (target.nextChairEliminates) value += 3;
    if (getSurvivorRoleLabel(target) === "修机位") value += 2;
    if (target.action && target.action.kind === "repairing") value += 1;
    return value;
  }

  function isAIMessengerSupportTarget(messenger, target) {
    return Boolean(
      target &&
      target !== messenger &&
      !target.escaped &&
      target.state !== "eliminated" &&
      target.state !== "seated" &&
      target.state !== "downed"
    );
  }

  function getAIMessengerSupport(survivor, now) {
    const carried = hunter.carrying;
    if (isAIMessengerSupportTarget(survivor, carried) && carried.state === "carried") {
      const support = {
        target: carried,
        mode: "carryRescue",
        value: getAIMessengerSupportValue(carried) + 2,
        until: now + AI_MESSENGER_ESCORT_DURATION
      };
      survivor.messengerSupport = support;
      return support;
    }

    const saved = survivor.messengerSupport;
    if (
      saved &&
      now < saved.until &&
      isAIMessengerSupportTarget(survivor, saved.target) &&
      (saved.target.state === "healthy" || saved.target.state === "injured")
    ) {
      return saved;
    }

    const candidate = getSurvivors()
      .filter((target) => {
        if (!isAIMessengerSupportTarget(survivor, target)) return false;
        if (target.state !== "injured") return false;
        const recentlyHit = now - (target.injuredAt || 0) <= AI_MESSENGER_HIT_SUPPORT_WINDOW;
        return recentlyHit && (hunter.target === target || now - (target.injuredAt || 0) <= 3000);
      })
      .sort((a, b) => {
        const aScore = distanceBetween(survivor, a) - getAIMessengerSupportValue(a) * 210 - (hunter.target === a ? 170 : 0);
        const bScore = distanceBetween(survivor, b) - getAIMessengerSupportValue(b) * 210 - (hunter.target === b ? 170 : 0);
        return aScore - bScore;
      })[0];

    if (!candidate) {
      survivor.messengerSupport = null;
      return null;
    }

    const support = {
      target: candidate,
      mode: "escort",
      value: getAIMessengerSupportValue(candidate),
      until: now + AI_MESSENGER_ESCORT_DURATION
    };
    survivor.messengerSupport = support;
    return support;
  }

  function prepareAIMessengerSupport(survivor, kind, now) {
    cancelSurvivorAction(survivor);
    survivor.kiteDecision = null;
    survivor.healDecision = null;
    survivor.objectiveDecision = null;
    survivor.wanderTarget = null;
    survivor.path = [];
    survivor.pathGoal = null;
    setAISurvivorTask(survivor, kind, now, 650);
  }

  function getAIMessengerSupportSpeed(survivor, now) {
    const injuredPenalty = survivor.state === "injured" ? 0.88 : 1;
    const hitBoost = now < (survivor.boostUntil || 0) ? 1.45 : 1;
    return survivor.speed * injuredPenalty * hitBoost * getSurvivorMoveSpeedMultiplier(survivor, now);
  }

  function getAIMessengerCarryRescuePoint(survivor) {
    const fromHunter = normalizeVector(survivor.x - hunter.x, survivor.y - hunter.y);
    const carried = hunter.carrying;
    const fallback = carried ? normalizeVector(carried.x - hunter.x, carried.y - hunter.y) : { x: 1, y: 0 };
    const direction = fromHunter.x || fromHunter.y ? fromHunter : fallback;
    const baseAngle = Math.atan2(direction.y, direction.x);
    const angles = [0, Math.PI / 6, -Math.PI / 6, Math.PI / 3, -Math.PI / 3, Math.PI / 2, -Math.PI / 2, Math.PI];
    const candidates = angles.map((offset) => ({
      x: hunter.x + Math.cos(baseAngle + offset) * AI_MESSENGER_CARRY_RESCUE_DISTANCE,
      y: hunter.y + Math.sin(baseAngle + offset) * AI_MESSENGER_CARRY_RESCUE_DISTANCE
    }));
    const firingPoint = candidates
      .filter((point) => isSafePosition(point.x, point.y, survivor.radius) && hasWalkableLine(point.x, point.y, hunter.x, hunter.y, PACKAGE_RADIUS))
      .sort((a, b) => distanceBetween(survivor, a) - distanceBetween(survivor, b))[0];
    return firingPoint || findNearestSafePosition(candidates[0].x, candidates[0].y, survivor.radius);
  }

  function updateAIMessengerCarryRescue(survivor, dt, now) {
    if (!isMessenger(survivor) || survivor.kind !== "ai") return false;
    if (survivor.state !== "healthy" && survivor.state !== "injured") return false;
    const carried = hunter.carrying;
    if (!isAIMessengerSupportTarget(survivor, carried) || carried.state !== "carried") return false;

    if (survivor.action && survivor.action.kind === "packageRecoil") {
      updateActorAction(survivor, now);
      return true;
    }

    if (!survivor.aiTask || survivor.aiTask.kind !== "messengerCarryRescue" || now >= survivor.aiTask.until) {
      prepareAIMessengerSupport(survivor, "messengerCarryRescue", now);
    }
    const hunterDistance = distanceBetween(survivor, hunter);
    if (
      canThrowPackage(survivor, now) &&
      hunterDistance <= PACKAGE_RANGE - 18 &&
      hasWalkableLine(survivor.x, survivor.y, hunter.x, hunter.y, PACKAGE_RADIUS)
    ) {
      throwPackage(survivor, Math.atan2(hunter.y - survivor.y, hunter.x - survivor.x), now);
      survivor.messengerSupport = {
        target: carried,
        mode: "escort",
        value: getAIMessengerSupportValue(carried) + 2,
        until: now + AI_MESSENGER_ESCORT_DURATION
      };
      showAssistAlert("信使投包救援", now, 850);
      return true;
    }

    const destination = getAIMessengerCarryRescuePoint(survivor);
    moveActorToPoint(survivor, destination.x, destination.y, getAIMessengerSupportSpeed(survivor, now) * 1.16, dt, now);
    return true;
  }

  function updateAIFighterCarryRescue(survivor, dt, now) {
    if (!isFighter(survivor) || survivor.kind !== "ai") return false;
    if (survivor.state !== "healthy" && survivor.state !== "injured") return false;
    const carried = hunter.carrying;
    if (!carried || carried === survivor || carried.state !== "carried") return false;

    if (survivor.action && survivor.action.kind === "fighterPunch") {
      updateActorAction(survivor, now);
      return true;
    }
    if (survivor.action) cancelSurvivorAction(survivor);

    const hunterDistance = distanceBetween(survivor, hunter);
    const canReachHunter = hasWalkableLine(survivor.x, survivor.y, hunter.x, hunter.y, survivor.radius);
    if (
      canUseFighterPunch(survivor, now) &&
      hunterDistance <= getFighterPunchRange() + hunter.radius * 0.5 - 6 &&
      canReachHunter
    ) {
      survivor.angle = Math.atan2(hunter.y - survivor.y, hunter.x - survivor.x);
      return startFighterPunch(survivor, now);
    }

    const fromHunter = normalizeVector(survivor.x - hunter.x, survivor.y - hunter.y);
    const carriedDirection = normalizeVector(carried.x - hunter.x, carried.y - hunter.y);
    const direction = fromHunter.x || fromHunter.y ? fromHunter : carriedDirection;
    const approach = findNearestSafePosition(
      hunter.x + direction.x * Math.max(58, getFighterPunchRange() - 20),
      hunter.y + direction.y * Math.max(58, getFighterPunchRange() - 20),
      survivor.radius
    );
    const injuryMultiplier = survivor.state === "injured" ? 0.88 : 1;
    const hitBoost = now < (survivor.boostUntil || 0) ? 1.45 : 1;
    const speed = survivor.speed * injuryMultiplier * hitBoost * getSurvivorMoveSpeedMultiplier(survivor, now);
    moveActorToPoint(survivor, approach.x, approach.y, speed, dt, now);
    return true;
  }

  function getAIMessengerEscortPoint(survivor, target, value) {
    const towardHunter = normalizeVector(hunter.x - target.x, hunter.y - target.y);
    const direction = towardHunter.x || towardHunter.y ? towardHunter : normalizeVector(survivor.x - target.x, survivor.y - target.y);
    const hunterTargetDistance = distanceBetween(hunter, target);
    const committed = value >= 3;
    const gap = Math.max(42, Math.min(committed ? 72 : 108, hunterTargetDistance * 0.58));
    const tangent = { x: -direction.y, y: direction.x };
    const side = committed ? 14 : 38;
    const candidates = [
      { x: target.x + direction.x * gap, y: target.y + direction.y * gap },
      { x: target.x + direction.x * gap + tangent.x * side, y: target.y + direction.y * gap + tangent.y * side },
      { x: target.x + direction.x * gap - tangent.x * side, y: target.y + direction.y * gap - tangent.y * side }
    ];
    return candidates.find((point) => isSafePosition(point.x, point.y, survivor.radius)) ||
      findNearestSafePosition(candidates[0].x, candidates[0].y, survivor.radius);
  }

  function updateAIMessengerSupport(survivor, dt, now, hunterDistance) {
    if (
      !isMessenger(survivor) ||
      survivor.kind !== "ai" ||
      survivor.action &&
      survivor.action.kind !== "repairing" &&
      survivor.action.kind !== "openingGate" &&
      survivor.action.kind !== "healing"
    ) return false;
    if (survivor.state !== "healthy" && survivor.state !== "injured") return false;
    const support = getAIMessengerSupport(survivor, now);
    if (!support) return false;

    const target = support.target;
    if (support.mode === "carryRescue" && hunter.carrying === target) {
      prepareAIMessengerSupport(survivor, "messengerCarryRescue", now);
      if (
        canThrowPackage(survivor, now) &&
        hunterDistance <= PACKAGE_RANGE - 18 &&
        hasWalkableLine(survivor.x, survivor.y, hunter.x, hunter.y, PACKAGE_RADIUS)
      ) {
        throwPackage(survivor, Math.atan2(hunter.y - survivor.y, hunter.x - survivor.x), now);
        survivor.messengerSupport = {
          target,
          mode: "escort",
          value: getAIMessengerSupportValue(target) + 2,
          until: now + AI_MESSENGER_ESCORT_DURATION
        };
        return true;
      }
      const destination = getAIMessengerCarryRescuePoint(survivor);
      moveActorToPoint(survivor, destination.x, destination.y, getAIMessengerSupportSpeed(survivor, now) * 1.08, dt, now);
      return true;
    }

    if (!isAIMessengerSupportTarget(survivor, target) || target.state !== "healthy" && target.state !== "injured") {
      survivor.messengerSupport = null;
      return false;
    }

    const committed = support.value >= 3;
    prepareAIMessengerSupport(survivor, "messengerEscort", now);
    const destination = getAIMessengerEscortPoint(survivor, target, support.value);
    moveActorToPoint(survivor, destination.x, destination.y, getAIMessengerSupportSpeed(survivor, now) * (committed ? 1.1 : 1.04), dt, now);
    return true;
  }

  function maybeUseAISurvivorSkill(survivor, hunterDistance, now) {
    if (maybeUseAIFlywheel(survivor, hunterDistance, now)) return true;
    if (maybeUseAIFighterPunch(survivor, hunterDistance, now)) return true;
    if (maybeUseAIFencerSkill(survivor, hunterDistance, now)) return true;
    if (maybeUseAIGeneralSkill(survivor, hunterDistance, now)) return true;
    if (maybeUseAIMedicSkill(survivor, hunterDistance, now)) return true;
    if (maybeUseAIClockmakerSkill(survivor, hunterDistance, now)) return true;
    if (maybeUseAIActorSkill(survivor, hunterDistance, now)) return true;
    if (maybeUseAINavigatorChannel(survivor, hunterDistance, now)) return true;
    if (maybeUseAIPerfumerSkill(survivor, hunterDistance, now)) return true;
    return false;
  }

  function maybeUseAIFlywheel(survivor, hunterDistance, now) {
    if (!canStartFlywheel(survivor, now)) return false;
    const pressured = hunter.target === survivor || hunterDistance <= hunter.attackRange + survivor.radius + 80;
    if (!pressured || hunterDistance > 260) return false;
    const angle = Math.atan2(survivor.y - hunter.y, survivor.x - hunter.x);
    if (Number.isFinite(angle)) survivor.angle = angle;
    return startFlywheel(survivor, now);
  }

  function maybeUseAIMedicSkill(survivor, hunterDistance, now) {
    if (!canUseMedicAdrenaline(survivor, now)) return false;
    const pressured = hunter.target === survivor || hunterDistance <= hunter.attackRange + survivor.radius + 100;
    if (!pressured || hunterDistance > 320) return false;
    return useMedicAdrenaline(survivor, now);
  }

  function maybeUseAIFencerSkill(survivor, hunterDistance, now) {
    if (!isFencer(survivor) || !canStartFencerLunge(survivor, now)) return false;
    const pressured = hunter.target === survivor || hunterDistance < 190;
    if (!pressured || hunterDistance < 74 || hunterDistance > 250) return false;
    if (!hasWalkableLine(survivor.x, survivor.y, hunter.x, hunter.y, survivor.radius)) return false;
    survivor.angle = Math.atan2(hunter.y - survivor.y, hunter.x - survivor.x);
    return startFencerLunge(survivor, now);
  }

  function maybeUseAIFighterPunch(survivor, hunterDistance, now) {
    if (!isFighter(survivor) || !canUseFighterPunch(survivor, now)) return false;
    const pressured = hunter.target === survivor || hunterDistance < 136;
    if (!pressured || hunterDistance > getFighterPunchRange() + hunter.radius * 0.5 - 6) return false;
    if (!hasWalkableLine(survivor.x, survivor.y, hunter.x, hunter.y, survivor.radius)) return false;
    survivor.angle = Math.atan2(hunter.y - survivor.y, hunter.x - survivor.x);
    return startFighterPunch(survivor, now);
  }

  function maybeUseAIGeneralSkill(survivor, hunterDistance, now) {
    if (!isGeneral(survivor) || !canUseGeneralSkill(survivor, now)) return false;
    if (isGeneralRiding(survivor, now)) {
      if (isGeneralRamReady(survivor)) return startGeneralRam(survivor, now);
      return whipGeneralHorse(survivor, now);
    }
    const pressured = hunter.target === survivor || hunterDistance <= hunter.attackRange + survivor.radius + 140;
    if (!pressured || hunterDistance > 420) return false;
    return startGeneralRide(survivor, now);
  }

  function maybeUseAIShieldGuard(survivor, hunterDistance, now) {
    if (!isShieldBearer(survivor) || !canUseShieldGuard(survivor, now)) return false;
    const attack = hunter.action;
    const attackThreat = attack && attack.kind === "attackWindup" &&
      hunterDistance <= hunter.attackRange + getHunterAttackLungeDistance() + survivor.radius + 48;
    const closeThreat = hunter.target === survivor && hunterDistance <= 118;
    if (!attackThreat && !closeThreat) return false;
    survivor.angle = Math.atan2(hunter.y - survivor.y, hunter.x - survivor.x);
    return useShieldGuard(survivor, now);
  }

  function maybeUseAIClockmakerSkill(survivor, hunterDistance, now) {
    if (!isClockmaker(survivor)) return false;
    const pressured = hunter.target === survivor || hunterDistance < 360;
    if (canActivateTimeRewind(survivor, now) && (survivor.state === "downed" || survivor.state === "injured" || hunterDistance < 240)) {
      activateTimeRewind(survivor, now);
      return true;
    }
    if (pressured && canPlaceTimeDevice(survivor, now)) {
      placeTimeDevice(survivor, now);
      return true;
    }
    return false;
  }

  function maybeUseAIActorSkill(survivor, hunterDistance, now) {
    if (!isActor(survivor) || !canUseActorRescuePhantom(survivor, now)) return false;
    if (findNearestSeatedSurvivor(survivor, Infinity)) return false;
    const guardTarget = getAIActorPhantomGuardTarget(survivor, hunterDistance, now);
    if (!guardTarget) return false;
    const guardPoint = getActorRescuePhantomGuardPoint(guardTarget);
    return useActorRescuePhantom(survivor, now, guardPoint.x, guardPoint.y, guardTarget);
  }

  function maybeUseAIActorInterruptPhantom(survivor, now) {
    if (!isActor(survivor) || !canUseActorRescuePhantom(survivor, now)) return false;
    const threat = getAIActorSawDashInterruption(survivor) || getAIActorEdictHookInterruption(survivor);
    if (!threat) return false;
    return useActorRescuePhantom(survivor, now, threat.x, threat.y, threat.target);
  }

  function getAIActorSawDashInterruption(survivor) {
    if (!isSawbone() || !hunter.action || hunter.action.kind !== "sawDash") return null;
    const target = isValidHunterChaseTarget(hunter.action.target) ? hunter.action.target : hunter.target;
    if (!isValidHunterChaseTarget(target)) return null;
    const direction = normalizeVector(target.x - hunter.x, target.y - hunter.y);
    const distance = distanceBetween(hunter, target);
    if ((!direction.x && !direction.y) || distance > 440) return null;
    const point = {
      x: target.x - direction.x * (target.radius + survivor.radius + 18),
      y: target.y - direction.y * (target.radius + survivor.radius + 18)
    };
    if (distanceBetween(survivor, point) > ACTOR_RESCUE_PHANTOM_RANGE || !hasWalkableLine(survivor.x, survivor.y, point.x, point.y, survivor.radius)) return null;
    return { ...point, target };
  }

  function getAIActorEdictHookInterruption(survivor) {
    if (!isEdictor() || edictHooks.length === 0) return null;
    let best = null;
    edictHooks.forEach((hook) => {
      const direction = normalizeVector(hook.vx, hook.vy);
      const remaining = Math.max(0, EDICTOR_HOOK_RANGE - hook.traveled);
      getSurvivors().forEach((target) => {
        if (target.escaped || target.state !== "healthy" && target.state !== "injured") return;
        const toTargetX = target.x - hook.x;
        const toTargetY = target.y - hook.y;
        const projection = toTargetX * direction.x + toTargetY * direction.y;
        const lateral = Math.abs(toTargetX * direction.y - toTargetY * direction.x);
        if (projection < 0 || projection > remaining || lateral > target.radius + EDICTOR_HOOK_RADIUS + 6) return;
        const distanceBeforeHit = Math.max(0, projection - target.radius - survivor.radius - EDICTOR_HOOK_RADIUS - 10);
        const point = {
          x: hook.x + direction.x * distanceBeforeHit,
          y: hook.y + direction.y * distanceBeforeHit
        };
        if (distanceBetween(survivor, point) > ACTOR_RESCUE_PHANTOM_RANGE || !hasWalkableLine(survivor.x, survivor.y, point.x, point.y, survivor.radius)) return;
        if (!best || projection < best.projection) best = { ...point, target, projection };
      });
    });
    return best;
  }

  function getAIActorPhantomGuardTarget(survivor, hunterDistance, now) {
    if (hunter.target === survivor && hunterDistance <= 360) return survivor;
    return getSurvivors()
      .filter((target) => target !== survivor && !target.escaped && (target.state === "healthy" || target.state === "injured"))
      .filter((target) => hunter.target === target && now < (target.boostUntil || 0) && distanceBetween(survivor, target) <= 460)
      .sort((a, b) => distanceBetween(hunter, a) - distanceBetween(hunter, b))[0] || null;
  }

  function maybeUseAIPerfumerSkill(survivor, hunterDistance, now) {
    if (!canUsePerfumeMist(survivor, now)) return false;
    if (hunter.target !== survivor && hunterDistance >= PERFUMER_SENSE_NEAR_RANGE) return false;
    usePerfumeSkill(survivor, now);
    return true;
  }

  function maybeUseAINavigatorChannel(survivor, hunterDistance, now) {
    if (!isNavigator(survivor) || !canStartNavigationChannelAim(survivor, now)) return false;
    if (!canAISurvivorSeeHunter(now)) return false;
    if (hunter.target === survivor || hunterDistance < 260) return false;
    const target = getSurvivors()
      .filter((candidate) => candidate !== survivor && !candidate.escaped && (candidate.state === "healthy" || candidate.state === "injured"))
      .filter((candidate) => hunter.target === candidate && distanceBetween(survivor, candidate) <= NAVIGATION_CHANNEL_AIM_RANGE)
      .sort((a, b) => distanceBetween(survivor, a) - distanceBetween(survivor, b))[0];
    if (!target) return false;
    const placement = getAINavigationChannelPlacement(survivor, target);
    if (!placement) return false;
    placeNavigationChannel(survivor, placement.x, placement.y, placement.angle, now);
    return true;
  }

  function getAINavigationChannelPlacement(owner, target) {
    if (!canAISurvivorSeeHunter()) return null;
    const escapeDirection = normalizeVector(target.x - hunter.x, target.y - hunter.y);
    if (!escapeDirection.x && !escapeDirection.y) return null;
    const tangent = { x: -escapeDirection.y, y: escapeDirection.x };
    const candidates = [
      { forward: 140, side: 0 },
      { forward: 190, side: 0 },
      { forward: 150, side: 78 },
      { forward: 150, side: -78 },
      { forward: 230, side: 96 },
      { forward: 230, side: -96 }
    ];
    let best = null;
    let bestScore = -Infinity;
    candidates.forEach((candidate) => {
      const point = findNearestSafePosition(
        target.x + escapeDirection.x * candidate.forward + tangent.x * candidate.side,
        target.y + escapeDirection.y * candidate.forward + tangent.y * candidate.side,
        target.radius
      );
      if (distanceBetween(owner, point) > NAVIGATION_CHANNEL_AIM_RANGE) return;
      const hunterDistance = distanceBetween(hunter, point);
      if (hunterDistance < 150) return;
      const preview = getNavigationChannelSlidePreview(point.x, point.y, Math.atan2(escapeDirection.y, escapeDirection.x), target.radius);
      if (preview.distance < NAVIGATION_CHANNEL_SLIDE_DISTANCE * 0.62) return;
      const approachDistance = distanceBetween(target, point);
      const score = (preview.safe ? 960 : preview.distance * 1.6) + hunterDistance * 0.55 - approachDistance * 0.34;
      if (score > bestScore) {
        best = { x: point.x, y: point.y, angle: Math.atan2(escapeDirection.y, escapeDirection.x) };
        bestScore = score;
      }
    });
    return best;
  }

  function maybeUseAITunerEcho(survivor, hunterDistance, now) {
    if (!canUseTunerEcho(survivor, now)) return false;
    if (hunter.target !== survivor || hunterDistance > 250) return false;
    const toHunter = normalizeVector(hunter.x - survivor.x, hunter.y - survivor.y);
    survivor.angle = Math.atan2(-toHunter.y, -toHunter.x);
    return useTunerEcho(survivor, now);
  }

  function maybeUseAIStitchPack(survivor, hunterDistance, now) {
    if (!canPlaceStitchPack(survivor)) return false;
    if (hunter.target === survivor || hunterDistance < 260) return false;
    if (canReceiveStitchPack(survivor)) {
      placeStitchPack(survivor, now, survivor);
      return true;
    }
    const target = findNearestStitchPackTarget(survivor, 280);
    if (!target) return false;
    placeStitchPack(survivor, now, target);
    return true;
  }

  function getQuickChatDuration(kind) {
    if (kind === "rescue") return QUICK_CHAT_RESCUE_DURATION;
    if (kind === "rescueClaim") return QUICK_CHAT_RESCUE_CLAIM_DURATION;
    if (kind === "wait") return QUICK_CHAT_WAIT_DURATION;
    if (kind === "heal") return QUICK_CHAT_HEAL_DURATION;
    if (kind === "help") return QUICK_CHAT_HELP_DURATION;
    return QUICK_CHAT_REPAIR_DURATION;
  }

  function getQuickChatLabel(kind) {
    if (kind === "rescue") return "快来救救我";
    if (kind === "rescueClaim") return "我来救人";
    if (kind === "wait") return "先不要走";
    if (kind === "heal") return "我需要治疗";
    if (kind === "help") return "我需要帮助";
    return "快修机";
  }

  function isQuickChatTargetAvailable(target) {
    return Boolean(
      target &&
      !target.escaped &&
      target.state !== "eliminated" &&
      target.state !== "carried"
    );
  }

  function getQuickChatRecipients(kind) {
    const candidates = teammates.filter((survivor) => {
      return isQuickChatTargetAvailable(survivor) && (survivor.state === "healthy" || survivor.state === "injured");
    });
    const recipients = quickChatRecipient && candidates.includes(quickChatRecipient)
      ? [quickChatRecipient]
      : candidates;
    if (kind === "help") return recipients.filter((survivor) => isActor(survivor) || isApprentice(survivor) || isNavigator(survivor));
    return recipients;
  }

  function getHighestProgressRepairPoint() {
    return repairPoints
      .filter((point) => !point.completed)
      .sort((a, b) => (b.progress || 0) - (a.progress || 0))[0] || null;
  }

  function clearAIQuickChatDirective(survivor) {
    if (survivor) survivor.quickChatDirective = null;
  }

  function isAIQuickChatRescueClaimActive(survivor, now = performance.now()) {
    const directive = survivor && survivor.quickChatDirective;
    return Boolean(directive && directive.kind === "rescueClaim" && now < directive.until);
  }

  function updateAINavigationChannelDirective(survivor, dt, now, hunterDistance) {
    const directive = survivor.navigationChannelDirective;
    if (!directive) return false;
    const channel = navigationChannels.find((candidate) => candidate.id === directive.channelId);
    if (now >= directive.until || !channel || channel.recipient !== survivor || hunter.target !== survivor) {
      survivor.navigationChannelDirective = null;
      return false;
    }
    if (getAINavigationChannelKiteTarget(survivor, hunterDistance) !== channel) {
      survivor.navigationChannelDirective = null;
      return false;
    }
    cancelSurvivorAction(survivor);
    survivor.kiteDecision = null;
    survivor.healDecision = null;
    survivor.objectiveDecision = null;
    survivor.wanderTarget = null;
    moveAISurvivorAway(survivor, dt, now, hunterDistance);
    return true;
  }

  function prepareAIQuickChatDirective(survivor, kind, target, now) {
    if (!survivor) return;
    survivor.quickChatDirective = {
      kind,
      target,
      point: kind === "repair" ? getHighestProgressRepairPoint() : null,
      until: now + getQuickChatDuration(kind)
    };
    if (kind === "rescueClaim") {
      if (survivor.action && survivor.action.kind === "rescuing") cancelSurvivorAction(survivor);
      return;
    }
    if (kind === "wait") {
      if (survivor.action && survivor.action.kind === "escaping") cancelSurvivorAction(survivor);
      return;
    }
    cancelSurvivorAction(survivor);
    survivor.healDecision = null;
    survivor.objectiveDecision = null;
    survivor.kiteDecision = null;
    survivor.wanderTarget = null;
    survivor.path = [];
    survivor.pathGoal = null;
  }

  function sendQuickChat(kind, now = performance.now()) {
    if (!matchStarted || selectedRole !== PLAYER_ROLE.survivor) return;
    const recipients = getQuickChatRecipients(kind);
    recipients.forEach((survivor) => prepareAIQuickChatDirective(survivor, kind, player, now));
    quickChatOpen = false;
    updateQuickChat();
    const targetName = quickChatRecipient ? getSurvivorDisplayName(quickChatRecipient) : "全队";
    const response = recipients.length ? `已通知${targetName}` : "没有可响应的队友";
    showAssistAlert(`${getQuickChatLabel(kind)} · ${response}`, now, 1100);
  }

  function updateAIQuickChatDirective(survivor, dt, now, hunterDistance) {
    const directive = survivor.quickChatDirective;
    if (!directive) return false;
    if (now >= directive.until || !isQuickChatTargetAvailable(directive.target)) {
      clearAIQuickChatDirective(survivor);
      return false;
    }

    const target = directive.target;
    if (directive.kind !== "rescue" && (hunter.target === survivor || hunterDistance < 230)) return false;

    if (directive.kind === "rescueClaim") return false;

    if (directive.kind === "wait") {
      if (survivor.action) return false;
      survivor.vx = 0;
      survivor.vy = 0;
      survivor.path = [];
      survivor.pathGoal = null;
      setAISurvivorTask(survivor, "quickWait", now, 700);
      return true;
    }

    if (directive.kind === "rescue") {
      if (target.state !== "seated" || !target.chair) {
        clearAIQuickChatDirective(survivor);
        return false;
      }
      if (survivor.action && survivor.action.kind === "rescuing" && survivor.action.target === target) return true;
      if (hunter.target === survivor && hunterDistance < 120) return false;
      cancelSurvivorAction(survivor);
      survivor.healDecision = null;
      survivor.objectiveDecision = null;
      survivor.kiteDecision = null;
      survivor.wanderTarget = null;
      setAISurvivorTask(survivor, "quickRescue", now, 900);
      if (distanceBetween(survivor, target.chair) < 92) {
        startRescue(survivor, target, now);
        clearAIQuickChatDirective(survivor);
        return true;
      }
      const standPoint = findNearestSafePosition(target.chair.x + 52, target.chair.y + 38, survivor.radius);
      moveActorToPoint(survivor, standPoint.x, standPoint.y, survivor.speed * 1.05, dt, now);
      return true;
    }

    if (directive.kind === "heal") {
      if (target.state !== "injured") {
        clearAIQuickChatDirective(survivor);
        return false;
      }
      survivor.healDecision = { target, until: directive.until };
      const handled = updateAIHealing(survivor, dt, now, hunterDistance);
      if (survivor.action && survivor.action.kind === "healing") clearAIQuickChatDirective(survivor);
      return handled;
    }

    if (directive.kind === "help") {
      if (isActor(survivor)) {
        if (!canUseActorRescuePhantom(survivor, now)) return true;
        if (distanceBetween(survivor, target) > ACTOR_RESCUE_PHANTOM_RANGE - 18) {
          moveActorToPoint(survivor, target.x, target.y, survivor.speed * 0.94, dt, now);
          return true;
        }
        const guardPoint = getActorRescuePhantomGuardPoint(target);
        if (useActorRescuePhantom(survivor, now, guardPoint.x, guardPoint.y, target)) clearAIQuickChatDirective(survivor);
        return true;
      }
      if (isApprentice(survivor)) {
        if (target.state !== "injured" || !canPlaceStitchPack(survivor)) {
          clearAIQuickChatDirective(survivor);
          return false;
        }
        if (distanceBetween(survivor, target) >= 280) {
          moveActorToPoint(survivor, target.x, target.y, survivor.speed * 0.94, dt, now);
          return true;
        }
        placeStitchPack(survivor, now, target);
        clearAIQuickChatDirective(survivor);
        return true;
      }
      if (isNavigator(survivor)) {
        if (!canStartNavigationChannelAim(survivor, now)) return true;
        if (distanceBetween(survivor, target) > NAVIGATION_CHANNEL_AIM_RANGE) {
          moveActorToPoint(survivor, target.x, target.y, survivor.speed * 0.94, dt, now);
          return true;
        }
        const placement = getAINavigationChannelPlacement(survivor, target);
        if (!placement) return true;
        placeNavigationChannel(survivor, placement.x, placement.y, placement.angle, now);
        clearAIQuickChatDirective(survivor);
        return true;
      }
      clearAIQuickChatDirective(survivor);
      return false;
    }

    if (!directive.point || directive.point.completed) directive.point = getHighestProgressRepairPoint();
    if (!directive.point) {
      clearAIQuickChatDirective(survivor);
      return false;
    }
    survivor.objectiveDecision = { kind: "repair", target: directive.point, until: directive.until };
    const handled = updateAIRepair(survivor, dt, now);
    if (directive.point.completed) clearAIQuickChatDirective(survivor);
    return handled;
  }

  function updateAIFinalCipherGuardObjective(survivor, dt, now) {
    if (!finalCipherGuard || finalCipherGuard.survivor !== survivor) return false;
    const point = finalCipherGuard.point;
    if (!point || point.completed || !isFinalCipherPoint(point)) return false;

    survivor.kiteDecision = null;
    survivor.objectiveDecision = { kind: "finalCipherGuard", target: point, until: now + 900 };
    survivor.wanderTarget = null;

    if (shouldPopPrimedFinalCipher(now)) {
      if (distanceBetween(survivor, point) < 96) {
        startRepair(survivor, point, now);
        return true;
      }
      const moved = moveActorToPoint(survivor, point.x, point.y, survivor.speed * 0.76, dt, now);
      if (moved < 0.5 && now > survivor.repathAt - 120) survivor.path = [];
      return true;
    }

    point.progress = Math.min(point.progress || 0, FINAL_CIPHER_PRIME_PROGRESS);
    if (survivor.action && survivor.action.kind === "repairing") {
      cancelRepair(survivor.action);
      survivor.action = null;
    }

    if (distanceBetween(survivor, point) > FINAL_CIPHER_GUARD_RANGE) {
      const moved = moveActorToPoint(survivor, point.x, point.y, survivor.speed * 0.68, dt, now);
      if (moved < 0.5 && now > survivor.repathAt - 120) survivor.path = [];
      return true;
    }

    survivor.vx = 0;
    survivor.vy = 0;
    return true;
  }

  function updateAIFinalCipherGuard(aiSurvivors, now) {
    const point = getPrimedFinalCipherPoint();
    if (!point || !shouldHoldFinalCipherPoint(point, now)) {
      finalCipherGuard = null;
      return;
    }

    if (
      finalCipherGuard &&
      finalCipherGuard.point === point &&
      isValidFinalCipherGuard(finalCipherGuard.survivor, point, now, aiSurvivors)
    ) {
      return;
    }

    const candidates = aiSurvivors.filter((survivor) => isValidFinalCipherGuard(survivor, point, now, aiSurvivors));
    candidates.sort((a, b) => getFinalCipherGuardScore(a, point) - getFinalCipherGuardScore(b, point));
    finalCipherGuard = candidates.length ? { point, survivor: candidates[0] } : null;
  }

  function getPrimedFinalCipherPoint() {
    if (getCompletedRepairCount() !== REPAIR_REQUIRED - 1) return null;
    return repairPoints
      .filter((point) => !point.completed && (point.progress || 0) >= FINAL_CIPHER_PRIME_PROGRESS)
      .sort((a, b) => (b.progress || 0) - (a.progress || 0))[0] || null;
  }

  function isValidFinalCipherGuard(survivor, point, now, aiSurvivors) {
    if (!survivor || survivor.kind !== "ai" || !aiSurvivors.includes(survivor)) return false;
    if (survivor.escaped || survivor.state !== "healthy" && survivor.state !== "injured") return false;
    if (hunter.target === survivor && distanceBetween(survivor, hunter) < 460) return false;
    if (!survivor.action) return true;
    return survivor.action.kind === "repairing" && survivor.action.point === point;
  }

  function getFinalCipherGuardScore(survivor, point) {
    const distance = distanceBetween(survivor, point);
    const hunterPressure = Math.max(0, 440 - distanceBetween(hunter, survivor));
    const injuredPenalty = survivor.state === "injured" ? 80 : 0;
    const adrenalinePenalty = hasSurvivorBadge(survivor, "adrenaline") ? 900 : 0;
    return distance + hunterPressure * 0.55 + injuredPenalty + adrenalinePenalty;
  }

  function maybeInterruptAIObjectiveForRescue(survivor, now) {
    if (isAIQuickChatRescueClaimActive(survivor, now)) return;
    if (!survivor.action || !["repairing", "openingGate"].includes(survivor.action.kind)) return;
    if (survivor.state === "downed" || survivor.escaped) return;
    if (distanceBetween(survivor, hunter) < 180) return;

    const chairTarget = getAIChairRescueTarget(survivor);
    if (hunter.target === survivor && !isCommittedAIChairRescueRole(survivor, chairTarget)) return;
    if (chairTarget && (isAISafeToRescueChair(survivor, distanceBetween(survivor, hunter), chairTarget) || isAIChairRescueEmergency(survivor, chairTarget))) {
      cancelAIObjectiveAction(survivor);
      return;
    }

    return;
  }

  function cancelAIObjectiveAction(survivor) {
    if (survivor.action && survivor.action.kind === "repairing") cancelRepair(survivor.action);
    if (survivor.action && survivor.action.kind === "openingGate") cancelGateOpen(survivor.action);
    survivor.action = null;
    survivor.objectiveDecision = null;
    survivor.kiteDecision = null;
    survivor.wanderTarget = null;
    survivor.path = [];
  }

  function maybeInterruptAIHealingForHunterThreat(survivor, hunterDistance, now) {
    if (!survivor.action || survivor.action.kind !== "healing") return false;
    const target = survivor.action.target;
    const targetHunterDistance = target ? distanceBetween(hunter, target) : Infinity;
    if (hunter.target !== survivor && hunterDistance > 220 && targetHunterDistance > 190) return false;

    cancelHealing(survivor.action);
    survivor.action = null;
    survivor.healDecision = null;
    survivor.kiteDecision = null;
    survivor.wanderTarget = null;
    survivor.path = [];
    survivor.pathGoal = null;
    survivor.nextInteractAt = now + 650;
    return true;
  }

  function updateAIHealing(survivor, dt, now, hunterDistance) {
    if (!isAISafeToHeal(survivor, hunterDistance)) {
      survivor.healDecision = null;
      return false;
    }

    const target = getAIHealTarget(survivor, now);
    if (!target) return false;

    survivor.kiteDecision = null;
    survivor.wanderTarget = null;

    if (distanceBetween(survivor, target) < 88) {
      startHealing(survivor, target, now);
      survivor.healDecision = null;
      return true;
    }

    const standPoint = getHealStandPoint(survivor, target);
    const moved = moveActorToPoint(survivor, standPoint.x, standPoint.y, survivor.speed * 0.92, dt, now);
    if (moved < 0.5 && now > survivor.repathAt - 120) {
      survivor.path = [];
      survivor.healDecision = null;
    }
    return true;
  }

  function updateAIDownedTeammateHealing(survivor, dt, now, hunterDistance) {
    const target = getAIDownedHealTarget(survivor, now);
    if (!target) return false;

    if (survivor.action && survivor.action.kind === "repairing") cancelRepair(survivor.action);
    if (survivor.action && survivor.action.kind === "openingGate") cancelGateOpen(survivor.action);
    if (survivor.action) return false;
    if (!isAISafeToHeal(survivor, hunterDistance)) return false;

    survivor.objectiveDecision = null;
    survivor.kiteDecision = null;
    survivor.wanderTarget = null;

    if (distanceBetween(survivor, target) < 88) {
      startHealing(survivor, target, now);
      survivor.healDecision = null;
      return true;
    }

    const standPoint = getHealStandPoint(survivor, target);
    const moved = moveActorToPoint(survivor, standPoint.x, standPoint.y, survivor.speed * 0.96, dt, now);
    if (moved < 0.5 && now > survivor.repathAt - 120) {
      survivor.path = [];
      survivor.healDecision = null;
    }
    return true;
  }

  function isAISafeToHeal(survivor, hunterDistance) {
    if (survivor.action || survivor.state === "downed") return false;
    if (survivor.state === "seated" || survivor.state === "carried" || survivor.state === "eliminated") return false;
    if (hunter.target === survivor) return false;
    if (hunterDistance < AI_HEALER_MIN_HUNTER_DISTANCE) return false;
    if (hunter.status === "attacking" || hunter.status === "cooldown") return false;
    return true;
  }

  function updateAIObjective(survivor, dt, now, hunterDistance) {
    if (isKiteSimulatorMode() && survivor !== player) {
      if (areExitsPowered()) return updateAIEscape(survivor, dt, now);
      return updateAIRepair(survivor, dt, now);
    }

    if (isPracticeTargetMode()) {
      survivor.objectiveDecision = null;
      return false;
    }

    if (isHatchOpen()) {
      return updateAIHatchObjective(survivor, dt, now);
    }

    if (areExitsPowered()) {
      if (!exitGates.some((gate) => gate.opened) && aiTeamPlan.gateOpener && aiTeamPlan.gateOpener !== survivor) return false;
      if (!isAISafeForEscapeObjective(survivor, hunterDistance)) {
        survivor.objectiveDecision = null;
        return false;
      }
      return updateAIEscape(survivor, dt, now);
    }

    if (!isAISafeForObjective(survivor, hunterDistance)) {
      survivor.objectiveDecision = null;
      return false;
    }

    return updateAIRepair(survivor, dt, now);
  }

  function updateAIChairRescue(survivor, dt, now, hunterDistance) {
    if (isAIQuickChatRescueClaimActive(survivor, now)) return false;
    const target = getAIChairRescueTarget(survivor);
    if (!target) return false;
    const emergency = isAIChairRescueEmergency(survivor, target);
    if (!isEmergencyAIChairRescuer(survivor) || !emergency && !isPreferredAIChairRescuer(survivor)) return false;

    if (maybeUseAIActorRescuePlan(survivor, target, now)) return true;
    if (!isAISafeToRescueChair(survivor, hunterDistance, target)) return false;

    survivor.healDecision = null;
    survivor.objectiveDecision = null;
    survivor.kiteDecision = null;
    survivor.wanderTarget = null;
    setAISurvivorTask(survivor, "rescue", now, 900);

    if (maybeUseAIChairRescueSkill(survivor, target, now, dt)) return true;

    if (distanceBetween(survivor, target.chair) < 92 && shouldAIStartChairRescueNow(survivor, target, now)) {
      startRescue(survivor, target, now);
      return true;
    }

    const standPoint = findNearestSafePosition(target.chair.x + 52, target.chair.y + 38, survivor.radius);
    const moved = moveActorToPoint(survivor, standPoint.x, standPoint.y, survivor.speed * 0.95, dt, now);
    if (moved < 0.5 && now > survivor.repathAt - 120) survivor.path = [];
    return true;
  }

  function maybeUseAIActorRescuePlan(survivor, target, now) {
    if (!isActor(survivor) || !target || !target.chair) return false;
    const chairDistance = distanceBetween(survivor, target.chair);

    if (chairDistance > AI_ACTOR_MAGIC_SHOW_RESCUE_DISTANCE && canUseMagicShow(survivor, now)) {
      survivor.magicShowMode = "rescue";
      return performMagicShow(survivor, now);
    }

    if (
      chairDistance <= AI_ACTOR_RESCUE_PHANTOM_CHAIR_RANGE &&
      isHunterCampingChair(target, now) &&
      canUseActorRescuePhantom(survivor, now)
    ) {
      const guardPoint = getActorRescuePhantomGuardPoint(target.chair);
      return useActorRescuePhantom(survivor, now, guardPoint.x, guardPoint.y, target);
    }

    return false;
  }

  function updateAIChairRescueAction(survivor, dt, now, hunterDistance) {
    const action = survivor.action;
    if (!action || action.kind !== "rescuing") return false;
    const target = action.target;
    if (!target || target.state !== "seated" || !target.chair) return updateActorAction(survivor, now);

    if (shouldAIReleaseChairRescueForAttack(survivor, target, hunterDistance)) {
      survivor.action = null;
      survivor.nextInteractAt = now + AI_RESCUE_ATTACK_DODGE_DELAY;
      survivor.path = [];
      survivor.pathGoal = null;
      const dodgePoint = getAIChairRescueDodgePoint(survivor, target);
      moveActorToPoint(survivor, dodgePoint.x, dodgePoint.y, survivor.speed, dt, now);
      return true;
    }

    return updateActorAction(survivor, now);
  }

  function updateAIHitRecoveryRescue(survivor, dt, now) {
    const recovery = survivor.aiHitRecoveryRescue;
    if (!recovery) return false;
    const target = recovery.target;
    if (
      now >= recovery.until ||
      survivor.state !== "healthy" && survivor.state !== "injured" ||
      !target || target.state !== "seated" || !target.chair
    ) {
      survivor.aiHitRecoveryRescue = null;
      return false;
    }
    if (survivor.action && survivor.action.kind === "rescuing" && survivor.action.target === target) {
      return updateActorAction(survivor, now);
    }
    setAISurvivorTask(survivor, "hitRecoveryRescue", now, 700);
    if (distanceBetween(survivor, target.chair) < 92) {
      startRescue(survivor, target, now);
      return true;
    }

    const standPoint = findNearestSafePosition(target.chair.x + 52, target.chair.y + 38, survivor.radius);
    const injuredPenalty = survivor.state === "injured" ? 0.88 : 1;
    const hitBoost = now < survivor.boostUntil ? 1.45 : 1;
    const speed = survivor.speed * injuredPenalty * hitBoost * getSurvivorMoveSpeedMultiplier(survivor, now);
    moveActorToPoint(survivor, standPoint.x, standPoint.y, speed * 1.08, dt, now);
    return true;
  }

  function shouldAIReleaseChairRescueForAttack(rescuer, target, hunterDistance) {
    const action = hunter.action;
    if (!action || action.kind !== "attackWindup" || !target || !target.chair) return false;
    const strikeReach = hunter.attackRange + getHunterAttackLungeDistance() + rescuer.radius + 28;
    if (hunterDistance > strikeReach) return false;
    const targetAngle = Math.atan2(rescuer.y - hunter.y, rescuer.x - hunter.x);
    return Math.abs(angleDifference(hunter.angle, targetAngle)) <= hunter.attackArc / 2 + 0.18;
  }

  function getAIChairRescueDodgePoint(rescuer, target) {
    const away = normalizeVector(rescuer.x - hunter.x, rescuer.y - hunter.y);
    const direction = away.x || away.y ? away : normalizeVector(rescuer.x - target.chair.x, rescuer.y - target.chair.y);
    const tangent = { x: -direction.y, y: direction.x };
    const candidates = [
      { x: rescuer.x + tangent.x * 104 + direction.x * 46, y: rescuer.y + tangent.y * 104 + direction.y * 46 },
      { x: rescuer.x - tangent.x * 104 + direction.x * 46, y: rescuer.y - tangent.y * 104 + direction.y * 46 },
      { x: rescuer.x + direction.x * 126, y: rescuer.y + direction.y * 126 }
    ];
    return candidates.find((point) => isSafePosition(point.x, point.y, rescuer.radius)) ||
      findNearestSafePosition(candidates[0].x, candidates[0].y, rescuer.radius);
  }

  function maybeUseAIChairRescueSkill(survivor, target, now, dt = 0) {
    if (!target || !target.chair || !isHunterCampingChair(target, now)) return false;
    if (maybeUseAIShieldGuard(survivor, distanceBetween(survivor, hunter), now)) return true;
    if (isActor(survivor)) return false;
    if (canUseMagicShow(survivor, now)) {
      const hunterDistance = distanceBetween(survivor, hunter);
      if (hunterDistance < 520) {
        const safe = getAIRescueSkillSafePoint(survivor, target);
        moveActorToPoint(survivor, safe.x, safe.y, survivor.speed * 0.95, dt, now);
        survivor.nextInteractAt = now + 220;
        return true;
      }
      survivor.magicShowMode = "rescue";
      return performMagicShow(survivor, now);
    }
    if (canThrowPackage(survivor, now) && hasWalkableLine(survivor.x, survivor.y, hunter.x, hunter.y, PACKAGE_RADIUS)) {
      throwPackage(survivor, Math.atan2(hunter.y - survivor.y, hunter.x - survivor.x), now);
      survivor.nextInteractAt = now + 520;
      return true;
    }
    if (canUsePerfumeMist(survivor, now)) {
      usePerfumeSkill(survivor, now);
      survivor.nextInteractAt = now + 520;
      return true;
    }
    if (canUseMedicAdrenaline(survivor, now)) {
      useMedicAdrenaline(survivor, now);
      survivor.nextInteractAt = now + 520;
      return true;
    }
    if (canUseGeneralSkill(survivor, now)) {
      useGeneralSkill(survivor, now);
      survivor.nextInteractAt = now + 520;
      return true;
    }
    if (canPlaceTimeDevice(survivor, now) && distanceBetween(survivor, target.chair) < 220) {
      placeTimeDevice(survivor, now);
      survivor.nextInteractAt = now + 520;
      return true;
    }
    return false;
  }

  function getAIRescueSkillSafePoint(survivor, target) {
    const awayFromHunter = normalizeVector(survivor.x - hunter.x, survivor.y - hunter.y);
    const fallback = normalizeVector(target.chair.x - hunter.x, target.chair.y - hunter.y);
    const direction = awayFromHunter.x || awayFromHunter.y ? awayFromHunter : fallback;
    const x = survivor.x + direction.x * 320;
    const y = survivor.y + direction.y * 320;
    return findNearestSafePosition(x, y, survivor.radius);
  }

  function isHunterCampingChair(target, now = performance.now()) {
    if (!target || !target.chair) return false;
    if (now < (hunter.wipeUntil || 0) || now < (hunter.stunnedUntil || 0)) return false;
    return distanceBetween(hunter, target.chair) < AI_RESCUE_HUNTER_NEAR_CHAIR;
  }

  function isPreferredAIChairRescuer(survivor) {
    if (aiTeamPlan.rescuer && isValidAIRescuePlannerActor(aiTeamPlan.rescuer, getSurvivors().filter((target) => target.state === "seated" && target.chair))) {
      return aiTeamPlan.rescuer === survivor;
    }
    if (!isAvailableAIChairRescuer(survivor)) return false;
    const ownPriority = getSurvivorRescuePriority(survivor);
    return !teammates.some((other) => {
      if (other === survivor || !isAvailableAIChairRescuer(other)) return false;
      return getSurvivorRescuePriority(other) < ownPriority;
    });
  }

  function isAvailableAIChairRescuer(survivor) {
    if (!survivor || survivor.escaped || survivor.action) return false;
    if (survivor.state !== "healthy" && survivor.state !== "injured") return false;
    if (hunter.target === survivor) return false;
    return true;
  }

  function isEmergencyAIChairRescuer(survivor) {
    if (!survivor || survivor.escaped || survivor.action) return false;
    return survivor.state === "healthy" || survivor.state === "injured";
  }

  function isAISafeToRescueChair(survivor, hunterDistance, target) {
    if (survivor.action || survivor.state !== "healthy" && survivor.state !== "injured") return false;
    const chairHunterDistance = target && target.chair ? distanceBetween(hunter, target.chair) : Infinity;
    const rescuerChairDistance = target && target.chair ? distanceBetween(survivor, target.chair) : Infinity;
    const urgent = target && target.chairProgress >= getAIRescueDangerProgress(target);
    const emergency = isAIChairRescueEmergency(survivor, target);
    const committedToRescue = rescuerChairDistance < 150;
    const hasRescueTool = hasReadyAIChairRescueTool(survivor, target);
    const directRescueRole = isCommittedAIChairRescueRole(survivor, target);
    if (hunter.target === survivor && !emergency && !directRescueRole) return false;
    if (hunter.target === survivor && rescuerChairDistance > 440 && !hasRescueTool && !directRescueRole) return false;
    if (hunterDistance < 220 && !urgent && !committedToRescue && !hasRescueTool && !directRescueRole) return false;
    if (chairHunterDistance < 235 && !urgent && !committedToRescue && !hasRescueTool && !directRescueRole) return false;
    return true;
  }

  function isCommittedAIChairRescueRole(survivor, target) {
    return Boolean(
      target &&
      target.state === "seated" &&
      target.chair &&
      (isRescueRoleSurvivor(survivor) || isAIHitClaimedChairRescuer(survivor, target)) &&
      isPreferredAIChairRescuer(survivor)
    );
  }

  function isAIHitClaimedChairRescuer(survivor, target, now = performance.now()) {
    const claim = survivor && survivor.aiHitRecoveryRescue;
    return Boolean(claim && now < claim.until && claim.target === target && target && target.state === "seated" && target.chair);
  }

  function isAIChairRescueEmergency(survivor, target) {
    if (!survivor || !target || target.state !== "seated" || !target.chair) return false;
    return target.chairProgress >= getAIRescueTargetProgress(target) - AI_RESCUE_EMERGENCY_WINDOW;
  }

  function hasReadyAIChairRescueTool(survivor, target, now = performance.now()) {
    if (!target || !target.chair || !isHunterCampingChair(target, now)) return false;
    return canThrowPackage(survivor, now) ||
      canUsePerfumeMist(survivor, now) ||
      canUseMedicAdrenaline(survivor, now) ||
      canUseGeneralSkill(survivor, now) ||
      canUseShieldGuard(survivor, now) ||
      canUseMagicShow(survivor, now) ||
      canPlaceTimeDevice(survivor, now) ||
      hasActiveAIRescueProtection(survivor, now);
  }

  function shouldAIStartChairRescueNow(rescuer, target, now) {
    if (!target || !target.chair) return false;
    const progress = target.chairProgress || 0;
    const chairHunterDistance = distanceBetween(hunter, target.chair);
    const hunterNearby = chairHunterDistance < AI_RESCUE_HUNTER_NEAR_CHAIR;
    if (willChairEliminateBeforeRescueCompletes(rescuer, target)) return true;
    if (!hunterNearby) return progress >= getAIRescueTargetProgress(target);
    if (now < (hunter.wipeUntil || 0) || now < (hunter.stunnedUntil || 0)) return true;
    if (hasActiveAIRescueProtection(rescuer, now)) return true;
    if (hunter.target === rescuer && distanceBetween(hunter, rescuer) < 160 && progress < getAIRescueDangerProgress(target)) return false;
    return progress >= getAIRescueDangerProgress(target);
  }

  function hasActiveAIRescueProtection(rescuer, now = performance.now()) {
    return hasMedicShield(rescuer, now) ||
      isBorrowedTimeProtected(rescuer, now) ||
      now < (rescuer.medicAdrenalineUntil || 0) ||
      Boolean(getActivePerfumeMistForActor(hunter, now));
  }

  function willChairEliminateBeforeRescueCompletes(rescuer, target) {
    if (!target || target.state !== "seated") return false;
    const remaining = 1 - (target.chairProgress || 0);
    const rescueProgressCost = getSurvivorRescueDuration(rescuer) / CHAIR_ELIMINATION_DURATION;
    return remaining <= rescueProgressCost + 0.015;
  }

  function getAIRescueTargetProgress(target) {
    return target && (target.chairProgress || 0) >= 0.5 ? AI_RESCUE_SECOND_CHAIR_TARGET : AI_RESCUE_FIRST_CHAIR_TARGET;
  }

  function getAIRescueDangerProgress(target) {
    return target && (target.chairProgress || 0) >= 0.5 ? AI_RESCUE_SECOND_CHAIR_DANGER : AI_RESCUE_FIRST_CHAIR_DANGER;
  }

  function getAIChairRescueTarget(rescuer) {
    let best = null;
    let bestScore = Infinity;
    getSurvivors().forEach((target) => {
      if (target === rescuer || target.state !== "seated" || !target.chair) return;
      if (isBeingRescued(target)) return;
      const distance = distanceBetween(rescuer, target.chair);
      const urgency = target.chairProgress * 520;
      const hunterDistance = distanceBetween(hunter, target.chair);
      const score = distance - urgency - hunterDistance * 0.12;
      if (score < bestScore) {
        best = target;
        bestScore = score;
      }
    });
    return best;
  }

  function claimAIChairRescueAfterBasicHit(survivor, now, options = {}, preferredTarget = null) {
    const aiControlled = survivor && (survivor.kind === "ai" || selectedRole === PLAYER_ROLE.hunter && survivor === player);
    if (!options.basicAttack || !aiControlled) return false;
    if (survivor.escaped || survivor.state !== "healthy" && survivor.state !== "injured") return false;
    const target = preferredTarget && preferredTarget.state === "seated" && preferredTarget.chair
      ? preferredTarget
      : getAIChairRescueTarget(survivor);
    if (!target || !target.chair || distanceBetween(survivor, target.chair) > AI_RESCUE_HIT_CLAIM_RANGE) return false;
    if (!survivor.action || survivor.action.kind !== "rescuing" || survivor.action.target !== target) {
      cancelSurvivorAction(survivor);
    }
    survivor.aiHitRecoveryRescue = { target, until: now + 10000 };
    survivor.healDecision = null;
    survivor.objectiveDecision = null;
    survivor.kiteDecision = null;
    survivor.wanderTarget = null;
    survivor.path = [];
    survivor.pathGoal = null;
    aiTeamPlan = {
      ...aiTeamPlan,
      rescuer: survivor,
      until: now + AI_TEAM_PLAN_INTERVAL
    };
    showAssistAlert(`${getSurvivorDisplayName(survivor)} 接手救援`, now, 900);
    return true;
  }

  function isAISafeForObjective(survivor, hunterDistance) {
    if (survivor.action || survivor.state !== "healthy" && survivor.state !== "injured" || survivor.escaped) return false;
    if (hunter.target === survivor) return false;
    return hunterDistance >= AI_OBJECTIVE_ABORT_RANGE + 35;
  }

  function isAISafeForEscapeObjective(survivor, hunterDistance) {
    if (survivor.action || survivor.state !== "healthy" && survivor.state !== "injured" || survivor.escaped) return false;
    const hasOpenedGate = exitGates.some((gate) => gate.opened);
    const nearGate = distanceToNearestGate(survivor) <= AI_OPEN_GATE_PRIORITY_RANGE;
    if (hasOpenedGate) return hunter.target !== survivor || hunterDistance >= AI_GATE_OPEN_ABORT_RANGE || nearGate;
    if (hunter.target === survivor) return nearGate && hunterDistance >= AI_GATE_ACTION_RANGE;
    return hunterDistance >= AI_GATE_OPEN_ABORT_RANGE || distanceToNearestGate(survivor) <= AI_OPEN_GATE_PRIORITY_RANGE;
  }

  function distanceToNearestGate(actor) {
    return exitGates.reduce((nearest, gate) => Math.min(nearest, distanceBetween(actor, gate)), Infinity);
  }

  function updateAISoulLampDismantle(survivor, dt, now, hunterDistance) {
    if (!isLanternKeeper() || soulLamps.length === 0) return false;
    if (!isAISafeForObjective(survivor, hunterDistance)) return false;

    const lamp = findNearestSoulLamp(survivor, SOUL_LAMP_AI_DISMANTLE_RANGE);
    if (!lamp) return false;

    survivor.kiteDecision = null;
    survivor.objectiveDecision = null;
    survivor.wanderTarget = null;

    if (distanceBetween(survivor, lamp) < SOUL_LAMP_DISMANTLE_RANGE) {
      startDismantleSoulLamp(survivor, lamp, now);
      return true;
    }

    const moved = moveActorToPoint(survivor, lamp.x, lamp.y, survivor.speed * 0.72, dt, now);
    if (moved < 0.5 && now > survivor.repathAt - 120) survivor.path = [];
    return true;
  }

  function updateAISoulPatrolDismantle(survivor, dt, now, hunterDistance) {
    if (!isSoulBinder() || survivor.escaped || survivor.state !== "healthy" && survivor.state !== "injured") return false;
    if (hunter.target === survivor || hunterDistance < AI_OBJECTIVE_ABORT_RANGE + 35) return false;
    if (survivor.action && survivor.action.kind !== "repairing") return false;
    const point = findNearestSoulPatrolPoint(survivor, 420);
    if (!point) return false;

    cancelSurvivorAction(survivor);
    survivor.kiteDecision = null;
    survivor.objectiveDecision = null;
    survivor.wanderTarget = null;
    if (distanceBetween(survivor, point) < SOUL_PATROL_DISMANTLE_RANGE) {
      startDismantleSoulPatrol(survivor, point, now);
      return true;
    }

    const moved = moveActorToPoint(survivor, point.x, point.y, survivor.speed * 0.72, dt, now);
    if (moved < 0.5 && now > survivor.repathAt - 120) survivor.path = [];
    return true;
  }

  function updateAIPeeperDismantle(survivor, dt, now, hunterDistance) {
    if (assistPeeperWards.length === 0 || !isAISafeForObjective(survivor, hunterDistance)) return false;
    const ward = findNearestPeeperWard(survivor, ASSIST_PEEPER_AI_DISMANTLE_RANGE, now);
    if (!ward) return false;

    survivor.kiteDecision = null;
    survivor.objectiveDecision = null;
    survivor.wanderTarget = null;
    if (distanceBetween(survivor, ward) < ASSIST_PEEPER_DISMANTLE_RANGE) {
      startDismantlePeeperWard(survivor, ward, now);
      return true;
    }

    const moved = moveActorToPoint(survivor, ward.x, ward.y, survivor.speed * 0.72, dt, now);
    if (moved < 0.5 && now > survivor.repathAt - 120) survivor.path = [];
    return true;
  }

  function updateAIRepair(survivor, dt, now) {
    const point = getAIRepairTarget(survivor, now);
    if (!point) return false;

    survivor.kiteDecision = null;
    survivor.wanderTarget = null;
    setAISurvivorTask(survivor, "repair", now, 1800);

    if (shouldHoldFinalCipherPoint(point, now)) {
      if (!finalCipherGuard || finalCipherGuard.survivor !== survivor) return false;
      point.progress = Math.min(point.progress || 0, FINAL_CIPHER_PRIME_PROGRESS);
      if (survivor.action && survivor.action.kind === "repairing") {
        cancelRepair(survivor.action);
        survivor.action = null;
      }
      survivor.vx = 0;
      survivor.vy = 0;
      return true;
    }

    if (distanceBetween(survivor, point) < 96) {
      startRepair(survivor, point, now);
      survivor.objectiveDecision = null;
      return true;
    }

    const moved = moveActorToPoint(survivor, point.x, point.y, survivor.speed * 0.74, dt, now);
    if (moved < 0.5 && now > survivor.repathAt - 120) {
      survivor.path = [];
      survivor.objectiveDecision = null;
    }
    return true;
  }

  function shouldAIRepairDuringDistantChase(survivor, hunterDistance) {
    if (areExitsPowered() || isHatchOpen() || hunterDistance < 440) return false;
    const chaseTarget = hunter.target;
    if (!chaseTarget || chaseTarget === survivor) return false;
    return chaseTarget.state === "healthy" || chaseTarget.state === "injured";
  }

  function shouldAIForcePopFinalCipher(survivor, hunterDistance) {
    if (!getPrimedFinalCipherPoint() || !shouldPopPrimedFinalCipher()) return false;
    return hunter.target !== survivor || hunterDistance >= 240;
  }

  function updateAIEscape(survivor, dt, now) {
    const gate = getAIEscapeTarget(survivor, now);
    if (!gate) return false;
    const gatePoint = gate.opened ? getAIGateEscapePoint(survivor, gate) : getAIGateInteractionPoint(survivor, gate);

    survivor.kiteDecision = null;
    survivor.wanderTarget = null;
    setAISurvivorTask(survivor, gate.opened ? "escape" : "openGate", now, 1200);

    if (isActorInGateUseRange(survivor, gate, gatePoint)) {
      if (gate.opened) startEscape(survivor, gate, now);
      else startOpenGate(survivor, gate, now);
      survivor.objectiveDecision = null;
      return true;
    }

    const moved = moveActorToPoint(survivor, gatePoint.x, gatePoint.y, survivor.speed * 0.72, dt, now);
    if (moved < 0.5 && now > survivor.repathAt - 120) {
      if (isActorInGateUseRange(survivor, gate, gatePoint)) {
        if (gate.opened) startEscape(survivor, gate, now);
        else startOpenGate(survivor, gate, now);
        survivor.objectiveDecision = null;
        return true;
      }
      survivor.path = [];
      survivor.objectiveDecision = null;
    }
    return true;
  }

  function getAIGateEscapePoint(survivor, gate) {
    const inwardX = gate.x < world.width / 2 ? 1 : -1;
    const inwardY = gate.y < world.height / 2 ? 1 : -1;
    const primaryHorizontal = Math.min(gate.x, world.width - gate.x) <= Math.min(gate.y, world.height - gate.y);
    const primary = primaryHorizontal ? { x: inwardX, y: 0 } : { x: 0, y: inwardY };
    const candidate = {
      x: gate.x + primary.x * 54,
      y: gate.y + primary.y * 54
    };
    if (isSafePosition(candidate.x, candidate.y, survivor.radius)) return candidate;
    return findNearestSafePosition(gate.x, gate.y, survivor.radius);
  }

  function getAIGateInteractionPoint(survivor, gate) {
    const inwardX = gate.x < world.width / 2 ? 1 : -1;
    const inwardY = gate.y < world.height / 2 ? 1 : -1;
    const primaryHorizontal = Math.min(gate.x, world.width - gate.x) <= Math.min(gate.y, world.height - gate.y);
    const primary = primaryHorizontal ? { x: inwardX, y: 0 } : { x: 0, y: inwardY };
    const tangent = primaryHorizontal ? { x: 0, y: 1 } : { x: 1, y: 0 };
    const distances = [72, 88, 104];
    const offsets = [0, 24, -24, 48, -48];
    let best = null;
    let bestScore = Infinity;

    distances.forEach((distance) => {
      offsets.forEach((offset) => {
        const candidate = {
          x: gate.x + primary.x * distance + tangent.x * offset,
          y: gate.y + primary.y * distance + tangent.y * offset
        };
        if (!isSafePosition(candidate.x, candidate.y, survivor.radius)) return;
        if (distanceBetween(candidate, gate) > 112) return;
        const routePenalty = hasWalkableLine(survivor.x, survivor.y, candidate.x, candidate.y, survivor.radius) ? 0 : 70;
        const score = distanceBetween(survivor, candidate) + routePenalty + Math.max(0, 520 - distanceBetween(hunter, candidate)) * 0.25;
        if (score < bestScore) {
          best = candidate;
          bestScore = score;
        }
      });
    });

    if (best) return best;

    const fallback = findNearestSafePosition(gate.x + primary.x * 88, gate.y + primary.y * 88, survivor.radius);
    return distanceBetween(fallback, gate) <= 112 ? fallback : findNearestSafePosition(gate.x, gate.y, survivor.radius);
  }

  function updateAIHatchObjective(survivor, dt, now) {
    if (!isHatchOpen()) return false;
    survivor.kiteDecision = null;
    survivor.wanderTarget = null;

    if (distanceBetween(survivor, hatch) < 88) {
      startHatchEscape(survivor, now);
      survivor.objectiveDecision = null;
      return true;
    }

    const moved = moveActorToPoint(survivor, hatch.x, hatch.y, survivor.speed * 0.72, dt, now);
    if (moved < 0.5 && now > survivor.repathAt - 120) {
      survivor.path = [];
      survivor.objectiveDecision = null;
    }
    return true;
  }

  function updateAIHatchEscape(survivor, dt, now) {
    return isHatchOpen() && updateAIHatchObjective(survivor, dt, now);
  }

  function updateAIDownedEscape(survivor, dt, now) {
    const gate = getBestAIGateTarget(survivor, exitGates.filter((item) => item.opened));
    const gatePoint = gate ? getAIGateEscapePoint(survivor, gate) : null;
    const gateDistance = gatePoint ? distanceBetween(survivor, gatePoint) : Infinity;
    const hatchAvailable = isHatchOpen();
    const hatchDistance = hatchAvailable ? distanceBetween(survivor, hatch) : Infinity;

    if (!gate && !hatchAvailable) return false;
    if (hatchAvailable && hatchDistance <= gateDistance) {
      survivor.objectiveDecision = { kind: "hatchEscape", target: hatch, until: now + 1200 };
      if (hatchDistance < 88) {
        startHatchEscape(survivor, now);
        return true;
      }
      const moved = moveActorToPoint(survivor, hatch.x, hatch.y, getDownedCrawlSpeed(survivor) * 0.85, dt, now);
      if (moved < 0.4 && now > survivor.repathAt - 120) survivor.path = [];
      return true;
    }

    survivor.objectiveDecision = { kind: "escape", target: gate, until: now + 1200 };
    if (isActorInGateUseRange(survivor, gate, gatePoint)) {
      startEscape(survivor, gate, now);
      return true;
    }
    const moved = moveActorToPoint(survivor, gatePoint.x, gatePoint.y, getDownedCrawlSpeed(survivor) * 0.85, dt, now);
    if (moved < 0.4 && now > survivor.repathAt - 120) survivor.path = [];
    return true;
  }

  function updateAIDownedHatchCrawl(survivor, dt, now) {
    const activeSurvivors = getActiveSurvivors();
    if (!isHatchOpen() || activeSurvivors.length !== 1 || activeSurvivors[0] !== survivor) return false;
    if (distanceBetween(survivor, hatch) < 88) {
      startHatchEscape(survivor, now);
      return true;
    }
    const crawlSpeed = getDownedCrawlSpeed(survivor) * 0.85;
    const moved = moveActorToPoint(survivor, hatch.x, hatch.y, crawlSpeed, dt, now);
    if (moved < 0.4 && now > survivor.repathAt - 120) survivor.path = [];
    return true;
  }

  function getAIRepairTarget(survivor, now) {
    if (shouldKeepObjectiveDecision(survivor, now, "repair")) return survivor.objectiveDecision.target;

    let best = null;
    let bestScore = Infinity;
    repairPoints.forEach((point) => {
      if (point.completed || isRepairingPoint(survivor, point)) return;
      if (shouldHoldFinalCipherPoint(point, now) && (!finalCipherGuard || finalCipherGuard.survivor !== survivor)) return;
      const distance = distanceBetween(survivor, point) * 0.68;
      const progressBonus = point.progress * 2800;
      const hunterPenalty = Math.max(0, 620 - distanceBetween(hunter, point)) * 1.15;
      const score = distance + hunterPenalty - progressBonus;
      if (score < bestScore) {
        best = point;
        bestScore = score;
      }
    });

    survivor.objectiveDecision = best ? { kind: "repair", target: best, until: now + 4200 } : null;
    return best;
  }

  function getAIEscapeTarget(survivor, now) {
    if (shouldKeepObjectiveDecision(survivor, now, "escape")) return survivor.objectiveDecision.target;

    const openedGate = getBestAIGateTarget(survivor, exitGates.filter((gate) => gate.opened));
    if (openedGate) {
      survivor.objectiveDecision = { kind: "escape", target: openedGate, until: now + 1800 };
      return openedGate;
    }

    const unopenedGate = getBestAIGateTarget(survivor, exitGates.filter((gate) => !gate.opened));
    survivor.objectiveDecision = unopenedGate ? { kind: "escape", target: unopenedGate, until: now + 1800 } : null;
    return unopenedGate;
  }

  function getBestAIGateTarget(survivor, gates) {
    let best = null;
    let bestScore = Infinity;
    gates.forEach((gate) => {
      const distance = distanceBetween(survivor, gate);
      const hunterPenalty = Math.max(0, 620 - distanceBetween(hunter, gate));
      const openedBonus = gate.opened ? 900 : 0;
      const progressBonus = gate.opened ? 0 : (gate.progress || 0) * 520;
      const workerBonus = gate.opened ? 0 : Math.min(2, gate.workers.length) * 90;
      const score = distance + hunterPenalty * 0.65 - openedBonus - progressBonus - workerBonus;
      if (score < bestScore) {
        best = gate;
        bestScore = score;
      }
    });

    return best;
  }

  function shouldKeepObjectiveDecision(survivor, now, kind) {
    const decision = survivor.objectiveDecision;
    if (!decision || decision.kind !== kind || now >= decision.until) return false;
    if (kind === "repair") return !decision.target.completed;
    if (kind === "escape" && decision.target && !decision.target.opened && exitGates.some((gate) => gate.opened)) return false;
    return areExitsPowered();
  }

  function isFinalCipherPoint(point) {
    return point && !point.completed && getCompletedRepairCount() === REPAIR_REQUIRED - 1;
  }

  function shouldHoldFinalCipherPoint(point, now = performance.now()) {
    return isFinalCipherPoint(point) &&
      (point.progress || 0) >= FINAL_CIPHER_PRIME_PROGRESS &&
      hasTeamPendingAdrenaline() &&
      !shouldPopPrimedFinalCipher(now);
  }

  function shouldCompletePrimedFinalCipher(actor, now = performance.now()) {
    return Boolean(actor && actor.kind === "player") || !hasTeamPendingAdrenaline() || shouldPopPrimedFinalCipher(now);
  }

  function hasTeamPendingAdrenaline() {
    return getSurvivors().some((survivor) => {
      return !survivor.escaped &&
        survivor.state !== "eliminated" &&
        survivor.state !== "seated" &&
        survivor.state !== "carried" &&
        hasSurvivorBadge(survivor, "adrenaline") &&
        !survivor.adrenalineTriggered;
    });
  }

  function shouldPopPrimedFinalCipher(now = performance.now()) {
    return getSurvivors().some((survivor) => {
      return !survivor.escaped &&
        survivor.state === "downed" &&
        hasSurvivorBadge(survivor, "adrenaline") &&
        !survivor.adrenalineTriggered;
    });
  }

  function pauseAIRepairers(point) {
    point.workers.forEach((worker) => {
      if (!worker || worker.kind !== "ai" || !worker.action || worker.action.kind !== "repairing") return;
      cancelRepair(worker.action);
      worker.action = null;
      worker.objectiveDecision = null;
      worker.vx = 0;
      worker.vy = 0;
    });
    point.workers = getActiveRepairers(point);
  }

  function cancelRepairPointWorkers(point) {
    point.workers.forEach((worker) => {
      if (!worker || !worker.action || worker.action.kind !== "repairing" || worker.action.point !== point) return;
      worker.action = null;
      worker.objectiveDecision = null;
      worker.vx = 0;
      worker.vy = 0;
    });
    point.workers = [];
  }

  function isRepairingPoint(actor, point) {
    return actor.action && actor.action.kind === "repairing" && actor.action.point === point;
  }

  function isOpeningGate(actor, gate) {
    return actor.action && actor.action.kind === "openingGate" && actor.action.gate === gate;
  }

  function getAIHealTarget(survivor, now) {
    if (shouldKeepHealDecision(survivor, now)) return survivor.healDecision.target;

    const target = findBestAIHealTarget(survivor);
    if (!target) {
      survivor.healDecision = null;
      return null;
    }

    survivor.healDecision = {
      target,
      until: now + 5200
    };
    return target;
  }

  function shouldKeepHealDecision(survivor, now) {
    const decision = survivor.healDecision;
    if (!decision || now >= decision.until) return false;
    return canAIHealTarget(decision.target, survivor);
  }

  function findBestAIHealTarget(healer) {
    let best = null;
    let bestScore = Infinity;
    getSurvivors().forEach((target) => {
      if (target === healer || !canAIHealTarget(target, healer)) return;
      const distance = distanceBetween(healer, target);
      if (distance > 760) return;
      const hunterDistance = distanceBetween(hunter, target);
      const downedPriority = target.state === "downed" ? 420 : 0;
      const score = distance - hunterDistance * 0.08 - (target.healProgress || 0) * 180 - downedPriority;
      if (score < bestScore) {
        best = target;
        bestScore = score;
      }
    });
    return best;
  }

  function canAIHealTarget(target, healer = null) {
    if (!canBeHealed(target) || target.state !== "injured" && target.state !== "downed") return false;
    const downed = target.state === "downed";
    if (!downed && hunter.target === target) return false;
    if (!downed && target.injuredAt && performance.now() - target.injuredAt < AI_HEAL_MIN_INJURED_AGE) return false;
    const safeDistance = downed ? AI_DOWNED_HEAL_TARGET_MIN_HUNTER_DISTANCE : AI_HEAL_TARGET_MIN_HUNTER_DISTANCE;
    if (distanceBetween(hunter, target) < safeDistance) return false;
    const assigned = getAssignedAIHealer(target, healer);
    return !assigned;
  }

  function getAIDownedHealTarget(healer, now) {
    if (isHatchOpen()) return null;
    if (shouldKeepHealDecision(healer, now) && healer.healDecision.target.state === "downed") return healer.healDecision.target;

    let best = null;
    let bestScore = Infinity;
    getSurvivors().forEach((target) => {
      if (target === healer || target.state !== "downed" || !canAIHealTarget(target, healer)) return;
      const distance = distanceBetween(healer, target);
      if (distance > AI_DOWNED_HEAL_MAX_DISTANCE) return;
      const score = distance - (target.healProgress || 0) * 220;
      if (score < bestScore) {
        best = target;
        bestScore = score;
      }
    });

    healer.healDecision = best ? { target: best, until: now + 3600 } : null;
    return best;
  }

  function getAssignedAIHealer(target, requester = null) {
    const active = getActiveHealers(target).find((healer) => healer !== requester && healer.kind === "ai");
    if (active) return active;
    return getSurvivors().find((survivor) => {
      if (survivor === requester || survivor === target || survivor.kind !== "ai") return false;
      return survivor.healDecision &&
        survivor.healDecision.target === target &&
        (!survivor.healDecision.until || performance.now() < survivor.healDecision.until);
    });
  }

  function getHealStandPoint(healer, target) {
    const away = normalizeVector(target.x - hunter.x, target.y - hunter.y);
    const baseAngle = Math.atan2(away.y, away.x);
    const angleOffsets = [0, 0.8, -0.8, 1.6, -1.6, Math.PI];
    const distances = [58, 74, 92];

    for (const distance of distances) {
      for (const offset of angleOffsets) {
        const angle = baseAngle + offset;
        const x = target.x + Math.cos(angle) * distance;
        const y = target.y + Math.sin(angle) * distance;
        if (isSafePosition(x, y, healer.radius)) return { x, y };
      }
    }

    return findNearestSafePosition(target.x + away.x * 74, target.y + away.y * 74, healer.radius);
  }

  function handleAIInteraction(survivor, now, hunterDistance) {
    if (survivor.state !== "healthy" && survivor.state !== "injured") return;
    if (survivor.action || now < survivor.nextInteractAt) return;

    const routeObstacle = getAIKiteRouteObstacle(survivor);
    if (routeObstacle) {
      const routeDistance = distanceToProp(survivor, routeObstacle);
      if (routeObstacle.label === "window" && routeDistance <= 100 && hunterDistance < 470) {
        startVault(survivor, routeObstacle, getSurvivorVaultDuration(survivor, 320), now, "vaulting");
        survivor.nextInteractAt = now + 900;
        return;
      }
      if (routeObstacle.label === "dropped" && routeDistance <= 90 && hunterDistance < 310) {
        startVault(survivor, routeObstacle, getSurvivorVaultDuration(survivor, 260), now, "vaulting");
        survivor.nextInteractAt = now + 850;
        return;
      }
      if (routeObstacle.label === "standing" && routeDistance <= 96 && hunterDistance < 235 && distanceBetween(hunter, routeObstacle) < 170) {
        dropPallet(survivor, routeObstacle, now);
        survivor.nextInteractAt = now + 850;
        return;
      }
    }

    const escapePoint = getKiteEscapeDestination(survivor, hunterDistance, now);
    const routeWindow = findUsefulWindowForRoute(survivor, escapePoint, 118);
    if (routeWindow && hunterDistance < 430) {
      startVault(survivor, routeWindow, getSurvivorVaultDuration(survivor, 320), now, "vaulting");
      survivor.nextInteractAt = now + 900;
      return;
    }

    const standingPallet = findNearestPallet(survivor, "standing", 86);
    if (standingPallet && hunterDistance < 210 && distanceBetween(hunter, standingPallet) < 130) {
      dropPallet(survivor, standingPallet, now);
      survivor.nextInteractAt = now + 850;
      return;
    }

    const droppedPallet = findNearestPallet(survivor, "dropped", 76);
    if (droppedPallet && hunterDistance < 260) {
      startVault(survivor, droppedPallet, getSurvivorVaultDuration(survivor, 260), now, "vaulting");
      survivor.nextInteractAt = now + 850;
      return;
    }

    const nearWindow = findNearestWindow(survivor, 78);
    if (nearWindow && hunterDistance < 330) {
      startVault(survivor, nearWindow, getSurvivorVaultDuration(survivor, 320), now, "vaulting");
      survivor.nextInteractAt = now + 850;
    }
  }

  function getAIKiteRouteObstacle(survivor) {
    const decision = survivor.kiteDecision;
    if (!decision || !decision.anchor || decision.anchor.label === "broken") return null;
    if (!windows.includes(decision.anchor) && !pallets.includes(decision.anchor)) return null;
    return decision.anchor;
  }

  function updateAIPalletMindgame(survivor, dt, now, hunterDistance) {
    const mindgame = survivor.palletMindgame;
    if (!mindgame) return false;
    const pallet = mindgame.pallet;
    if (!pallet || pallet.label !== "standing" || survivor.state !== "healthy" || hunter.target !== survivor) {
      survivor.palletMindgame = null;
      return false;
    }

    const hunterPalletDistance = distanceBetween(hunter, pallet);
    const hunterSwinging = hunter.action && hunter.action.kind === "attackWindup";
    if (hunterPalletDistance <= 92 && (hunterSwinging || hunterDistance < 132 || now >= mindgame.until)) {
      dropPallet(survivor, pallet, now);
      survivor.palletMindgame = null;
      survivor.nextInteractAt = now + 850;
      return true;
    }

    if (now >= mindgame.until) {
      survivor.palletMindgame = null;
      return false;
    }

    survivor.vx = 0;
    survivor.vy = 0;
    setAISurvivorTask(survivor, "palletMindgame", now, AI_PALLET_MINDGAME_DURATION);
    return true;
  }

  function tryStartAIPalletMindgame(survivor, now, hunterDistance) {
    if (survivor.palletMindgame || survivor.state !== "healthy" || hunter.target !== survivor) return false;
    if (!isConfidentAIPalletPlayer(survivor) || hunterDistance < 96 || hunterDistance > 230) return false;
    if (aiTeamPlan.rescuer === survivor && getAIChairRescueTarget(survivor)) return false;
    const pallet = findNearestPallet(survivor, "standing", 82);
    if (!pallet || distanceBetween(hunter, pallet) > 168) return false;
    survivor.palletMindgame = { pallet, until: now + AI_PALLET_MINDGAME_DURATION };
    survivor.path = [];
    survivor.pathGoal = null;
    survivor.vx = 0;
    survivor.vy = 0;
    return true;
  }

  function isConfidentAIPalletPlayer(survivor) {
    const character = getSurvivorCharacter(survivor);
    return getSurvivorRoleLabel(survivor) === "牵制位" || (character.chaseDifficulty || 1) >= 1.12;
  }

  function setAISurvivorTask(survivor, kind, now, minimumDuration) {
    const task = survivor.aiTask;
    if (!task || task.kind !== kind || now >= task.until) {
      survivor.aiTask = { kind, until: now + minimumDuration };
    }
  }

  function moveAISurvivorAway(survivor, dt, now, hunterDistance) {
    setAISurvivorTask(survivor, "kite", now, 700);
    if (survivor.action) return;
    const channel = getAINavigationChannelKiteTarget(survivor, hunterDistance);
    if (channel) {
      survivor.kiteDecision = null;
      const channelDistance = distanceBetween(survivor, channel);
      if (channelDistance <= NAVIGATION_CHANNEL_RADIUS + survivor.radius && useNavigationChannelRide(survivor, now)) return;
      const injuredPenalty = survivor.state === "injured" ? 0.88 : 1;
      const hitBoost = now < survivor.boostUntil ? 1.45 : 1;
      const panicBoost = hunterDistance < 310 ? 1.12 : 1;
      const speed = survivor.speed * injuredPenalty * hitBoost * panicBoost * getSurvivorMoveSpeedMultiplier(survivor, now);
      const moved = moveActorToPoint(survivor, channel.x, channel.y, speed, dt, now);
      if (moved < 0.5 && now > survivor.repathAt - 120) {
        survivor.path = [];
        survivor.pathGoal = null;
        survivor.repathAt = 0;
      }
      return;
    }
    const destination = getKiteEscapeDestination(survivor, hunterDistance, now);
    const routeWindow = findUsefulWindowForRoute(survivor, destination, 118);
    if (routeWindow && hunterDistance < 430 && !survivor.action && now >= survivor.nextInteractAt) {
      startVault(survivor, routeWindow, getSurvivorVaultDuration(survivor, 320), now, "vaulting");
      survivor.nextInteractAt = now + 900;
      return;
    }

    const injuredPenalty = survivor.state === "injured" ? 0.88 : 1;
    const hitBoost = now < survivor.boostUntil ? 1.45 : 1;
    const panicBoost = hunterDistance < 310 ? 1.12 : 1;
    const speed = survivor.speed * injuredPenalty * hitBoost * panicBoost * getSurvivorMoveSpeedMultiplier(survivor, now);
    const moved = moveActorToPoint(survivor, destination.x, destination.y, speed, dt, now);
    if (moved < 0.5 && now > survivor.repathAt - 120) {
      survivor.path = [];
      survivor.pathGoal = null;
      survivor.repathAt = 0;
      survivor.kiteDecision = null;
      const fallback = getAIReachableUnstuckPoint(survivor, hunter);
      if (fallback) moveActorToPoint(survivor, fallback.x, fallback.y, speed, dt, now);
    }
  }

  function getAINavigationChannelKiteTarget(survivor, hunterDistance) {
    if (hunter.target !== survivor || hunterDistance > 620 || survivor.action || navigationChannels.length === 0) return null;
    const escapeDirection = normalizeVector(survivor.x - hunter.x, survivor.y - hunter.y);
    let best = null;
    let bestScore = Infinity;
    navigationChannels.forEach((channel) => {
      const channelDistance = distanceBetween(survivor, channel);
      const hunterChannelDistance = distanceBetween(hunter, channel);
      if (channelDistance > 620 || hunterChannelDistance < hunter.radius + 118) return;
      const approach = normalizeVector(channel.x - survivor.x, channel.y - survivor.y);
      const slideDirection = { x: Math.cos(channel.angle), y: Math.sin(channel.angle) };
      const approachAlignment = approach.x * escapeDirection.x + approach.y * escapeDirection.y;
      const slideAlignment = slideDirection.x * escapeDirection.x + slideDirection.y * escapeDirection.y;
      if (slideAlignment < 0.18 || channelDistance > 116 && approachAlignment < -0.2) return;
      const dangerPenalty = Math.max(0, 360 - hunterChannelDistance) * 2;
      const score = channelDistance * 0.78 + dangerPenalty + (1 - slideAlignment) * 150 + Math.max(0, -approachAlignment) * 180;
      if (score < bestScore) {
        best = channel;
        bestScore = score;
      }
    });
    return best;
  }

  function getAIReachableUnstuckPoint(survivor, threat) {
    const away = normalizeVector(survivor.x - threat.x, survivor.y - threat.y);
    const direction = away.x || away.y ? away : { x: 1, y: 0 };
    const tangent = { x: -direction.y, y: direction.x };
    const offsets = [
      { forward: 1, side: 0 },
      { forward: 0.72, side: 0.72 },
      { forward: 0.72, side: -0.72 },
      { forward: 0.2, side: 1 },
      { forward: 0.2, side: -1 },
      { forward: -0.5, side: 0.9 },
      { forward: -0.5, side: -0.9 }
    ];
    const distances = [220, 160, 110];
    for (const distance of distances) {
      for (const offset of offsets) {
        const point = {
          x: survivor.x + direction.x * distance * offset.forward + tangent.x * distance * offset.side,
          y: survivor.y + direction.y * distance * offset.forward + tangent.y * distance * offset.side
        };
        if (!isSafePosition(point.x, point.y, survivor.radius)) continue;
        if (hasWalkableLine(survivor.x, survivor.y, point.x, point.y, survivor.radius)) return point;
        if (findPath(survivor.x, survivor.y, point.x, point.y, survivor.radius).length > 0) return point;
      }
    }
    return null;
  }

  function moveAISurvivorWander(survivor, dt, now) {
    if (!survivor.wanderTarget || distanceBetween(survivor, survivor.wanderTarget) < 70) {
      survivor.wanderTarget = pickWanderTarget();
    }

    const moved = moveActorToPoint(
      survivor,
      survivor.wanderTarget.x,
      survivor.wanderTarget.y,
      survivor.speed * 0.45,
      dt,
      now
    );
    if (moved < 0.5 && now > survivor.repathAt - 120) {
      survivor.path = [];
      survivor.wanderTarget = pickWanderTarget();
    }
  }

  function getKiteEscapeDestination(survivor, hunterDistance, now) {
    if (survivor.kiteEscapeOverride && now < survivor.kiteEscapeOverride.until) {
      return survivor.kiteEscapeOverride.destination;
    }
    survivor.kiteEscapeOverride = null;
    if (shouldKeepKiteDecision(survivor, now)) {
      if (distanceBetween(survivor, survivor.kiteDecision.destination) < 58) {
        refreshKiteDecisionDestination(survivor, now);
      }
      return survivor.kiteDecision.destination;
    }

    const away = normalizeVector(survivor.x - hunter.x, survivor.y - hunter.y);
    const farTarget = findBestDistantKiteTarget(survivor, hunterDistance);
    if (farTarget) {
      survivor.kiteDecision = createKiteDecision(survivor, farTarget, "rotate", away, now);
      return survivor.kiteDecision.destination;
    }

    const loopTarget = findBestLocalKiteTarget(survivor);
    if (loopTarget) {
      survivor.kiteDecision = createKiteDecision(survivor, loopTarget, "loop", away, now);
      return survivor.kiteDecision.destination;
    }

    survivor.kiteDecision = null;
    return getEscapeDestination(survivor);
  }

  function shouldKeepKiteDecision(survivor, now) {
    const decision = survivor.kiteDecision;
    if (!decision || !decision.anchor || now >= decision.until) return false;
    if (decision.anchor.label === "broken") return false;
    if (now < (decision.committedUntil || 0)) return true;

    const hunterDistanceToAnchor = distanceBetween(hunter, decision.anchor);
    if (decision.mode === "rotate" && hunterDistanceToAnchor < 250) return false;
    if (decision.mode === "loop" && distanceBetween(survivor, decision.anchor) > 420) return false;
    return true;
  }

  function createKiteDecision(survivor, anchor, mode, away, now) {
    const normal = getObstacleNormal(anchor);
    const tangent = { x: -normal.y, y: normal.x };
    const side = Math.sign((survivor.x - anchor.x) * normal.x + (survivor.y - anchor.y) * normal.y) ||
      Math.sign(away.x * normal.x + away.y * normal.y) ||
      1;
    const circleDirection = Math.sign((hunter.x - anchor.x) * tangent.x + (hunter.y - anchor.y) * tangent.y) || 1;
    const routeExit = getAIKiteRouteExitPoint(survivor, anchor, side);
    const decision = {
      mode,
      anchor,
      side,
      circleDirection,
      routeExit,
      nextAnchor: findAIKiteRouteNextAnchor(survivor, anchor, routeExit),
      destination: null,
      until: now + (mode === "rotate" ? 1750 : 1350),
      committedUntil: now + AI_KITE_ROUTE_LOCK_DURATION
    };
    decision.destination = getKiteDecisionDestination(survivor, decision, away);
    return decision;
  }

  function refreshKiteDecisionDestination(survivor, now) {
    const away = normalizeVector(survivor.x - hunter.x, survivor.y - hunter.y);
    survivor.kiteDecision.destination = getKiteDecisionDestination(survivor, survivor.kiteDecision, away);
    survivor.kiteDecision.until = now + (survivor.kiteDecision.mode === "rotate" ? 1250 : 950);
    survivor.kiteDecision.committedUntil = now + Math.min(AI_KITE_ROUTE_LOCK_DURATION, 700);
  }

  function getKiteDecisionDestination(survivor, decision, away) {
    if (decision.mode === "rotate") {
      return getKiteApproachPoint(decision.anchor, away, survivor.radius, decision.side);
    }
    return getKiteLoopPoint(survivor, decision.anchor, away, decision.side, decision.circleDirection);
  }

  function getAIKiteRouteExitPoint(survivor, anchor, side) {
    const normal = getObstacleNormal(anchor);
    const distance = anchor.label === "window" ? 138 : 112;
    return findNearestSafePosition(
      anchor.x - normal.x * side * distance,
      anchor.y - normal.y * side * distance,
      survivor.radius
    );
  }

  function findAIKiteRouteNextAnchor(survivor, currentAnchor, exitPoint) {
    let best = null;
    let bestScore = -Infinity;
    getKiteSpawnAnchors().forEach((candidate) => {
      if (candidate === currentAnchor || candidate.label === "broken") return;
      const survivorDistance = distanceBetween(exitPoint, candidate);
      const hunterDistance = distanceBetween(hunter, candidate);
      if (survivorDistance < 220 || survivorDistance > 820 || hunterDistance < 260) return;
      const routePenalty = hasWalkableLine(exitPoint.x, exitPoint.y, candidate.x, candidate.y, survivor.radius) ? 0 : 75;
      const score = hunterDistance * 1.05 - survivorDistance * 0.42 - routePenalty;
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    });
    return best;
  }

  function findBestDistantKiteTarget(survivor, currentHunterDistance) {
    const candidates = getKiteSpawnAnchors();
    let best = null;
    let bestScore = -Infinity;
    candidates.forEach((item) => {
      const survivorDistance = distanceBetween(survivor, item);
      const hunterDistance = distanceBetween(hunter, item);
      if (survivorDistance < 120 || survivorDistance > 900) return;
      if (hunterDistance < 420) return;

      const safetyGain = hunterDistance - currentHunterDistance;
      const raceAdvantage = hunterDistance - survivorDistance;
      if (safetyGain < 120 && raceAdvantage < 70) return;

      const routePenalty = hasWalkableLine(survivor.x, survivor.y, item.x, item.y, survivor.radius) ? 0 : 70;
      const score = hunterDistance * 1.16 + raceAdvantage * 0.85 - survivorDistance * 0.38 - routePenalty;
      if (score > bestScore) {
        best = item;
        bestScore = score;
      }
    });
    return best;
  }

  function findBestLocalKiteTarget(survivor) {
    const candidates = getKiteSpawnAnchors();
    let best = null;
    let bestScore = Infinity;
    candidates.forEach((item) => {
      const survivorDistance = distanceBetween(survivor, item);
      if (survivorDistance > 330) return;
      const hunterDistance = distanceBetween(hunter, item);
      const score = survivorDistance - hunterDistance * 0.22;
      if (score < bestScore) {
        best = item;
        bestScore = score;
      }
    });
    return best;
  }

  function getKiteApproachPoint(anchor, away, radius, lockedSide = null) {
    const normal = getObstacleNormal(anchor);
    const tangent = { x: -normal.y, y: normal.x };
    const side = lockedSide || Math.sign(away.x * normal.x + away.y * normal.y) || 1;
    const distances = anchor.label === "window" ? [110, 140, 170, 210] : [86, 118, 150, 190];
    const offsets = [0, 28, -28, 56, -56, 84, -84];

    for (const distance of distances) {
      for (const offset of offsets) {
        const x = anchor.x + normal.x * side * distance + tangent.x * offset;
        const y = anchor.y + normal.y * side * distance + tangent.y * offset;
        if (isSafePosition(x, y, radius)) return { x, y };
      }
    }

    return findNearestSafePosition(anchor.x + away.x * 150, anchor.y + away.y * 150, radius);
  }

  function getKiteLoopPoint(survivor, anchor, away, lockedSide = null, lockedCircleDirection = null) {
    const normal = getObstacleNormal(anchor);
    const tangent = { x: -normal.y, y: normal.x };
    const side = lockedSide || Math.sign((survivor.x - anchor.x) * normal.x + (survivor.y - anchor.y) * normal.y) || 1;
    const circleDirection = lockedCircleDirection ||
      Math.sign((hunter.x - anchor.x) * tangent.x + (hunter.y - anchor.y) * tangent.y) ||
      1;
    const distances = anchor.label === "window" ? [118, 150, 180] : [92, 122, 156];
    const offsets = [80, 120, 160, -80, -120, -160];

    for (const distance of distances) {
      for (const offset of offsets) {
        const adjustedOffset = offset * -circleDirection;
        const x = anchor.x + normal.x * side * distance + tangent.x * adjustedOffset + away.x * 28;
        const y = anchor.y + normal.y * side * distance + tangent.y * adjustedOffset + away.y * 28;
        if (isSafePosition(x, y, survivor.radius)) return { x, y };
      }
    }

    return getKiteApproachPoint(anchor, away, survivor.radius);
  }

  function findBestKiteTarget(survivor) {
    return findBestDistantKiteTarget(survivor, distanceBetween(survivor, hunter)) ||
      findBestLocalKiteTarget(survivor);
  }

  function getEscapeDestination(survivor) {
    const away = normalizeVector(survivor.x - hunter.x, survivor.y - hunter.y);
    return findNearestSafePosition(
      survivor.x + away.x * 360,
      survivor.y + away.y * 360,
      survivor.radius
    );
  }

  function findUsefulWindowForRoute(actor, goal, range) {
    if (hasWalkableLine(actor.x, actor.y, goal.x, goal.y, actor.radius)) return null;

    let best = null;
    let bestScore = Infinity;
    windows.forEach((item) => {
      if (isWindowBlockedForActor(item, actor)) return;
      const distance = distanceBetween(actor, item);
      if (distance > range) return;
      const normal = getObstacleNormal(item);
      const side = Math.sign((actor.x - item.x) * normal.x + (actor.y - item.y) * normal.y) || 1;
      const destination = findVaultDestination(actor, item, normal, side);
      if (distanceBetween(destination, actor) < 20) return;
      const improvement = distanceBetween(actor, goal) - distanceBetween(destination, goal);
      const wall = findWallContainingWindow(item);
      const longWallBonus = wall && Math.max(wall.w, wall.h) >= 220 ? 80 : 0;
      const score = distance - improvement * 0.8 - longWallBonus;
      if (improvement > -30 && score < bestScore) {
        best = item;
        bestScore = score;
      }
    });
    return best;
  }

  function findWallContainingWindow(windowItem) {
    return walls.find((wall) => {
      const margin = 24;
      return windowItem.x >= wall.x - margin &&
        windowItem.x <= wall.x + wall.w + margin &&
        windowItem.y >= wall.y - margin &&
        windowItem.y <= wall.y + wall.h + margin;
    });
  }

  function normalizeVector(x, y) {
    const length = Math.hypot(x, y);
    if (length < 0.001) return { x: 0, y: 0 };
    return { x: x / length, y: y / length };
  }

  function moveActor(actor, dx, dy) {
    return moveActorSmart(actor, dx, dy);
  }

  function moveActorSimple(actor, dx, dy) {
    return moveActorSmart(actor, dx, dy);
  }

  function moveActorPhasing(actor, dx, dy) {
    const beforeX = actor.x;
    const beforeY = actor.y;
    actor.x = actorClamp(actor.x + dx, 70, world.width - 70);
    actor.y = actorClamp(actor.y + dy, 70, world.height - 70);
    return Math.hypot(actor.x - beforeX, actor.y - beforeY);
  }

  function moveActorSmart(actor, dx, dy, options = {}) {
    if (!options.forceCollision && isFighterArenaParticipant(actor)) {
      if (isFighterArenaPreparing()) return 0;
      return moveActorPhasing(actor, dx, dy);
    }
    if (!options.forceCollision && actor === hunter && isSoulPatrolActive()) return moveHunterWithSoulPatrol(actor, dx, dy);
    if (!options.forceCollision && actor === hunter && isSoulSiphonPhaseMove(dx, dy)) return moveActorPhasing(actor, dx, dy);
    const beforeX = actor.x;
    const beforeY = actor.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 0.001) return 0;
    const steps = Math.max(1, Math.ceil(distance / MOVE_COLLISION_STEP));
    const stepDx = dx / steps;
    const stepDy = dy / steps;

    for (let step = 0; step < steps; step += 1) {
      moveActorStep(actor, stepDx, stepDy);
    }

    return Math.hypot(actor.x - beforeX, actor.y - beforeY);
  }

  function moveHunterWithSoulPatrol(actor, dx, dy) {
    const beforeX = actor.x;
    const beforeY = actor.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 0.001) return 0;
    const steps = Math.max(1, Math.ceil(distance / MOVE_COLLISION_STEP));
    const stepDx = dx / steps;
    const stepDy = dy / steps;

    for (let step = 0; step < steps; step += 1) {
      if (trySoulPatrolInstantVault(actor, stepDx, stepDy)) continue;
      moveActorStep(actor, stepDx, stepDy);
    }

    actor.x = actorClamp(actor.x, 70, world.width - 70);
    actor.y = actorClamp(actor.y, 70, world.height - 70);
    return Math.hypot(actor.x - beforeX, actor.y - beforeY);
  }

  function trySoulPatrolInstantVault(actor, dx, dy) {
    if ((hunter.soulPatrolInstantVaultsLeft || 0) <= 0) return false;
    const nextX = actor.x + dx;
    const nextY = actor.y + dy;
    const candidates = [
      ...pallets.filter((pallet) => pallet.label === "dropped").map((pallet) => ({ obstacle: pallet, rect: getPalletCollisionRect(pallet), approach: SOUL_PATROL_INSTANT_PALLET_APPROACH })),
      ...windows.map((windowItem) => ({ obstacle: windowItem, rect: getWindowCollisionRect(windowItem), approach: SOUL_PATROL_INSTANT_WINDOW_APPROACH }))
    ]
      .filter((candidate) => circleHitsRect(nextX, nextY, actor.radius + candidate.approach, candidate.rect))
      .map((candidate) => {
        const normal = getObstacleNormal(candidate.obstacle);
        const side = Math.sign((actor.x - candidate.obstacle.x) * normal.x + (actor.y - candidate.obstacle.y) * normal.y) ||
          (dx * normal.x + dy * normal.y > 0 ? -1 : 1);
        return { ...candidate, normal, side };
      })
      .filter((candidate) => (dx * candidate.normal.x + dy * candidate.normal.y) * candidate.side < -0.02)
      .sort((a, b) => distanceToProp(actor, a.obstacle) - distanceToProp(actor, b.obstacle));
    const candidate = candidates[0];
    if (!candidate) return false;

    const destination = findVaultDestination(actor, candidate.obstacle, candidate.normal, candidate.side);
    actor.x = destination.x;
    actor.y = destination.y;
    hunter.soulPatrolInstantVaultsLeft = Math.max(0, (hunter.soulPatrolInstantVaultsLeft || 0) - 1);
    actor.path = [];
    actor.pathGoal = null;
    return true;
  }

  function moveActorStep(actor, dx, dy) {
    const beforeX = actor.x;
    const beforeY = actor.y;
    if (!actorCollides(actor, actor.x + dx, actor.y + dy, actor.radius)) {
      actor.x += dx;
      actor.y += dy;
      resolveWallCornerOverlap(actor);
      return Math.hypot(actor.x - beforeX, actor.y - beforeY);
    }

    const primaryFirst = Math.abs(dx) >= Math.abs(dy);
    const attempts = primaryFirst
      ? [[dx, 0], [0, dy], [dx * 0.72, 0], [0, dy * 0.72], [dx * 0.42, 0], [0, dy * 0.42]]
      : [[0, dy], [dx, 0], [0, dy * 0.72], [dx * 0.72, 0], [0, dy * 0.42], [dx * 0.42, 0]];

    for (const [tryDx, tryDy] of attempts) {
      if (!actorCollides(actor, actor.x + tryDx, actor.y + tryDy, actor.radius)) {
        actor.x += tryDx;
        actor.y += tryDy;
        resolveWallCornerOverlap(actor);
        return Math.hypot(actor.x - beforeX, actor.y - beforeY);
      }
    }

    if (maybeTriggerMirrorBloomOnCurtain(actor, beforeX + dx, beforeY + dy)) {
      return Math.hypot(actor.x - beforeX, actor.y - beforeY);
    }

    actor.x += dx;
    actor.y += dy;
    if (resolveWallCornerOverlap(actor)) {
      return Math.hypot(actor.x - beforeX, actor.y - beforeY);
    }

    actor.x = beforeX;
    actor.y = beforeY;
    return 0;
  }

  function resolveWallCornerOverlap(actor) {
    const startX = actor.x;
    const startY = actor.y;
    let changed = false;

    for (let pass = 0; pass < 4; pass += 1) {
      let pushedThisPass = false;
      for (const box of getCollisionRects()) {
        const push = getCircleRectPush(actor.x, actor.y, actor.radius, box);
        if (!push) continue;
        actor.x += push.x;
        actor.y += push.y;
        changed = true;
        pushedThisPass = true;
      }
      if (!pushedThisPass) break;
    }

    actor.x = actorClamp(actor.x, 70, world.width - 70);
    actor.y = actorClamp(actor.y, 70, world.height - 70);
    if (collides(actor.x, actor.y, actor.radius)) {
      actor.x = startX;
      actor.y = startY;
      return false;
    }
    return changed;
  }

  function getCircleRectPush(cx, cy, radius, box) {
    const closestX = Math.max(box.x, Math.min(cx, box.x + box.w));
    const closestY = Math.max(box.y, Math.min(cy, box.y + box.h));
    const dx = cx - closestX;
    const dy = cy - closestY;
    const distance = Math.hypot(dx, dy);

    if (distance > 0 && distance < radius) {
      const depth = radius - distance + COLLISION_PUSH_EPSILON;
      return { x: dx / distance * depth, y: dy / distance * depth };
    }
    if (distance >= radius) return null;

    const toLeft = Math.abs(cx - box.x);
    const toRight = Math.abs(box.x + box.w - cx);
    const toTop = Math.abs(cy - box.y);
    const toBottom = Math.abs(box.y + box.h - cy);
    const nearest = Math.min(toLeft, toRight, toTop, toBottom);
    if (nearest === toLeft) return { x: -(radius + toLeft + COLLISION_PUSH_EPSILON), y: 0 };
    if (nearest === toRight) return { x: radius + toRight + COLLISION_PUSH_EPSILON, y: 0 };
    if (nearest === toTop) return { x: 0, y: -(radius + toTop + COLLISION_PUSH_EPSILON) };
    return { x: 0, y: radius + toBottom + COLLISION_PUSH_EPSILON };
  }

  function moveActorToPoint(actor, targetX, targetY, speed, dt, now) {
    if (actor && actor.kind === "ai" && now < (actor.abyssConfusedUntil || 0)) {
      targetX = actor.x - (targetX - actor.x);
      targetY = actor.y - (targetY - actor.y);
    }
    if (actor !== hunter && actor.state === "downed") {
      speed = Math.min(speed, getDownedCrawlSpeed(actor));
    }
    const directDistance = Math.hypot(targetX - actor.x, targetY - actor.y);
    if (directDistance < 4) {
      actor.vx = 0;
      actor.vy = 0;
      return 0;
    }

    if (isFighterArenaParticipant(actor)) {
      const toTarget = normalizeVector(targetX - actor.x, targetY - actor.y);
      const step = Math.min(speed * dt, Math.max(0, directDistance - 3));
      const beforeX = actor.x;
      const beforeY = actor.y;
      const moved = moveActorSmart(actor, toTarget.x * step, toTarget.y * step);
      if (moved > 0.01) {
        actor.angle = Math.atan2(actor.y - beforeY, actor.x - beforeX);
        actor.vx = (actor.x - beforeX) / Math.max(dt, 0.001);
        actor.vy = (actor.y - beforeY) / Math.max(dt, 0.001);
      } else {
        actor.vx = 0;
        actor.vy = 0;
      }
      return moved;
    }

    if (actor === hunter && isSoulSiphonPhasing(now)) {
      const toTarget = normalizeVector(targetX - actor.x, targetY - actor.y);
      const step = Math.min(speed * dt, Math.max(0, directDistance - 3));
      const dx = toTarget.x * step;
      const dy = toTarget.y * step;
      const beforeX = actor.x;
      const beforeY = actor.y;
      const moved = moveActorSmart(actor, dx, dy);
      if (moved > 0.01) {
        actor.angle = Math.atan2(actor.y - beforeY, actor.x - beforeX);
        actor.vx = (actor.x - beforeX) / Math.max(dt, 0.001);
        actor.vy = (actor.y - beforeY) / Math.max(dt, 0.001);
      } else {
        actor.vx = 0;
        actor.vy = 0;
      }
      return moved;
    }

    const goal = findNearestSafePosition(targetX, targetY, actor.radius);
    let waypoint = goal;
    let usingLocalAvoidance = false;

    if (actor.localAvoidance && now < actor.localAvoidance.until) {
      if (distanceBetween(actor, actor.localAvoidance) > 28 && hasActorWalkableLine(actor, actor.x, actor.y, actor.localAvoidance.x, actor.localAvoidance.y, actor.radius)) {
        waypoint = actor.localAvoidance;
        usingLocalAvoidance = true;
      } else {
        actor.localAvoidance = null;
      }
    }

    if (!usingLocalAvoidance && !hasWalkableLine(actor.x, actor.y, goal.x, goal.y, actor.radius)) {
      const goalChanged = !actor.pathGoal || distanceBetween(actor.pathGoal, goal) > nav.cell;
      if (!actor.path || actor.path.length === 0 || goalChanged || now >= actor.repathAt) {
        actor.path = findPath(actor.x, actor.y, goal.x, goal.y, actor.radius);
        actor.path = smoothPath(actor.x, actor.y, actor.path, actor.radius);
        actor.pathGoal = goal;
        actor.repathAt = now + 1100;
      }

      while (actor.path && actor.path.length > 1 && distanceBetween(actor, actor.path[0]) < 54) {
        actor.path.shift();
      }

      if (actor.path && actor.path.length > 0) {
        waypoint = actor.path[0];
      }
    } else if (!usingLocalAvoidance) {
      actor.path = [];
      actor.pathGoal = goal;
    }

    const toWaypoint = normalizeVector(waypoint.x - actor.x, waypoint.y - actor.y);
    const step = Math.min(speed * dt, Math.max(0, distanceBetween(actor, waypoint) - 3));
    const dx = toWaypoint.x * step;
    const dy = toWaypoint.y * step;
    const beforeX = actor.x;
    const beforeY = actor.y;
    const moved = moveActorSmart(actor, dx, dy);

    const blockedByObstacle = step > MOVE_COLLISION_STEP * 0.35 && moved < step * 0.38;
    if (blockedByObstacle) {
      const detour = findLocalAvoidanceWaypoint(actor, waypoint, goal);
      if (detour) {
        actor.localAvoidance = { ...detour, until: now + 900 };
        actor.path = [];
        actor.repathAt = now + 180;
      }
    }

    if (moved > 0.01) {
      actor.angle = Math.atan2(actor.y - beforeY, actor.x - beforeX);
      actor.vx = (actor.x - beforeX) / Math.max(dt, 0.001);
      actor.vy = (actor.y - beforeY) / Math.max(dt, 0.001);
      if (usingLocalAvoidance && distanceBetween(actor, waypoint) < 30) actor.localAvoidance = null;
    } else if (now >= actor.repathAt - 160) {
      actor.path = [];
      actor.repathAt = now + 260;
    }

    return moved;
  }

  function hasActorWalkableLine(actor, fromX, fromY, toX, toY, radius) {
    const distance = Math.hypot(toX - fromX, toY - fromY);
    const steps = Math.max(1, Math.ceil(distance / 20));
    for (let index = 1; index <= steps; index += 1) {
      const progress = index / steps;
      const x = fromX + (toX - fromX) * progress;
      const y = fromY + (toY - fromY) * progress;
      if (actorCollides(actor, x, y, radius)) return false;
    }
    return true;
  }

  function findLocalAvoidanceWaypoint(actor, blockedWaypoint, goal) {
    const forward = normalizeVector(blockedWaypoint.x - actor.x, blockedWaypoint.y - actor.y);
    if (!forward.x && !forward.y) return null;
    const tangent = { x: -forward.y, y: forward.x };
    const lastSide = actor.localAvoidanceSide || 1;
    const sides = [lastSide, -lastSide];
    let best = null;
    let bestScore = Infinity;

    [76, 116, 160].forEach((sideDistance) => {
      sides.forEach((side) => {
        const forwardDistance = Math.min(68, sideDistance * 0.48);
        const candidate = {
          x: actor.x + tangent.x * side * sideDistance + forward.x * forwardDistance,
          y: actor.y + tangent.y * side * sideDistance + forward.y * forwardDistance,
          side
        };
        if (!hasActorWalkableLine(actor, actor.x, actor.y, candidate.x, candidate.y, actor.radius)) return;
        const score = distanceBetween(candidate, goal) + (side === lastSide ? 0 : 16) + sideDistance * 0.08;
        if (score < bestScore) {
          best = candidate;
          bestScore = score;
        }
      });
    });

    if (best) actor.localAvoidanceSide = best.side;
    return best;
  }

  function hasWalkableLine(fromX, fromY, toX, toY, radius) {
    const distance = Math.hypot(toX - fromX, toY - fromY);
    const steps = Math.max(1, Math.ceil(distance / 32));
    for (let i = 1; i <= steps; i += 1) {
      const t = i / steps;
      const x = fromX + (toX - fromX) * t;
      const y = fromY + (toY - fromY) * t;
      if (!isSafePosition(x, y, radius)) return false;
    }
    return true;
  }

  function findPath(startX, startY, goalX, goalY, radius) {
    const start = nearestWalkableCell(worldToCell(startX, startY), radius);
    const goal = nearestWalkableCell(worldToCell(goalX, goalY), radius);
    if (!start || !goal) return [];

    const startKey = cellKey(start);
    const goalKey = cellKey(goal);
    const open = [start];
    const cameFrom = new Map();
    const gScore = new Map([[startKey, 0]]);
    const fScore = new Map([[startKey, cellDistance(start, goal)]]);
    const closed = new Set();

    while (open.length > 0) {
      open.sort((a, b) => (fScore.get(cellKey(a)) ?? Infinity) - (fScore.get(cellKey(b)) ?? Infinity));
      const current = open.shift();
      const currentKey = cellKey(current);
      if (currentKey === goalKey) return reconstructPath(cameFrom, current).map(cellToWorld);
      closed.add(currentKey);

      for (const neighbor of getNeighbors(current, radius)) {
        const neighborKey = cellKey(neighbor);
        if (closed.has(neighborKey)) continue;

        const tentativeG = (gScore.get(currentKey) ?? Infinity) + cellDistance(current, neighbor);
        if (tentativeG >= (gScore.get(neighborKey) ?? Infinity)) continue;

        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeG);
        fScore.set(neighborKey, tentativeG + cellDistance(neighbor, goal));
        if (!open.some((cell) => cellKey(cell) === neighborKey)) open.push(neighbor);
      }
    }

    return [];
  }

  function worldToCell(x, y) {
    return {
      col: actorClamp(Math.floor(x / nav.cell), 0, nav.cols - 1),
      row: actorClamp(Math.floor(y / nav.cell), 0, nav.rows - 1)
    };
  }

  function cellToWorld(cell) {
    return {
      x: actorClamp(cell.col * nav.cell + nav.cell / 2, 80, world.width - 80),
      y: actorClamp(cell.row * nav.cell + nav.cell / 2, 80, world.height - 80)
    };
  }

  function cellKey(cell) {
    return `${cell.col},${cell.row}`;
  }

  function cellDistance(a, b) {
    return Math.hypot(a.col - b.col, a.row - b.row);
  }

  function isCellWalkable(cell, radius) {
    if (cell.col < 0 || cell.row < 0 || cell.col >= nav.cols || cell.row >= nav.rows) return false;
    const point = cellToWorld(cell);
    return isSafePosition(point.x, point.y, radius);
  }

  function nearestWalkableCell(cell, radius) {
    if (isCellWalkable(cell, radius)) return cell;
    for (let ring = 1; ring <= 5; ring += 1) {
      for (let dc = -ring; dc <= ring; dc += 1) {
        for (let dr = -ring; dr <= ring; dr += 1) {
          if (Math.abs(dc) !== ring && Math.abs(dr) !== ring) continue;
          const candidate = { col: cell.col + dc, row: cell.row + dr };
          if (isCellWalkable(candidate, radius)) return candidate;
        }
      }
    }
    return null;
  }

  function getNeighbors(cell, radius) {
    const dirs = [
      { col: 1, row: 0 },
      { col: -1, row: 0 },
      { col: 0, row: 1 },
      { col: 0, row: -1 },
      { col: 1, row: 1 },
      { col: 1, row: -1 },
      { col: -1, row: 1 },
      { col: -1, row: -1 }
    ];
    return dirs
      .map((dir) => ({ col: cell.col + dir.col, row: cell.row + dir.row, dir }))
      .filter((candidate) => {
        if (!isCellWalkable(candidate, radius)) return false;
        if (candidate.dir.col !== 0 && candidate.dir.row !== 0) {
          const horizontal = { col: cell.col + candidate.dir.col, row: cell.row };
          const vertical = { col: cell.col, row: cell.row + candidate.dir.row };
          return isCellWalkable(horizontal, radius) && isCellWalkable(vertical, radius);
        }
        return true;
      })
      .map((candidate) => ({ col: candidate.col, row: candidate.row }));
  }

  function reconstructPath(cameFrom, current) {
    const path = [current];
    let key = cellKey(current);
    while (cameFrom.has(key)) {
      current = cameFrom.get(key);
      path.unshift(current);
      key = cellKey(current);
    }
    return path.slice(1);
  }

  function smoothPath(fromX, fromY, path, radius) {
    if (!path || path.length <= 1) return path || [];

    const result = [];
    let anchor = { x: fromX, y: fromY };
    let index = 0;

    while (index < path.length) {
      let farthest = index;
      for (let next = path.length - 1; next >= index; next -= 1) {
        if (hasWalkableLine(anchor.x, anchor.y, path[next].x, path[next].y, radius)) {
          farthest = next;
          break;
        }
      }
      result.push(path[farthest]);
      anchor = path[farthest];
      index = farthest + 1;
    }

    return result;
  }

  function maybeUseAIAbyssSkill(target, now, distance) {
    if (!isAbyss() || selectedRole === PLAYER_ROLE.hunter || !target) return false;
    if (isAbyssForm(now)) {
      if (canUseAbyssProjection(now) && distance > hunter.attackRange * 1.2 && distance < 640) {
        return useAbyssProjection(now);
      }
    } else {
      if (canStartAbyssForm(now)) return startAbyssForm(now);
      if (canUseAbyssWhisper(now) && distance < ABYSS_WHISPER_RANGE && (target.action || distance > hunter.attackRange * 1.4)) {
        return useAbyssWhisper(now);
      }
    }
    if (canUseAbyssTentacle(now) && distance > hunter.attackRange * 1.25 && distance < ABYSS_TENTACLE_RANGE) {
      return useAbyssTentacle(now, target.x, target.y);
    }
    return false;
  }

  function updateHunter(dt, now) {
    if (updateActorAction(hunter, now)) return;
    updateCarriedSurvivorPosition();

    if (now < hunter.stunnedUntil) {
      if (maybeUseAIHunterExcitement(now)) return;
      hunter.status = "stunned";
      return;
    }

    if (now < hunter.wipeUntil) {
      hunter.status = hunter.lastAttackHit ? "wipe" : "miss";
      return;
    }

    if (updateAIPatroller(dt, now)) return;

    if (updateAIHunterChairing(dt, now)) return;

    const target = chooseHunterTarget();
    hunter.target = target;
    if (!target) {
      if (isHunterInPerfumeMist(now)) {
        updateAIHunterBlindInPerfume(dt, now);
        return;
      }
      hunter.status = "allDowned";
      return;
    }
    hunter.lastKnownTargetX = target.x;
    hunter.lastKnownTargetY = target.y;

    const toTargetX = target.x - hunter.x;
    const toTargetY = target.y - hunter.y;
    const distance = Math.hypot(toTargetX, toTargetY);
    const canAttack = canHunterAttack(now);

    const desiredAttackAngle = Math.atan2(toTargetY, toTargetX);
    hunter.angle = turnToward(hunter.angle, desiredAttackAngle, hunter.turnSpeed * dt);

    if (maybeUseAIAbyssSkill(target, now, distance)) return;
    if (maybeUseAIHoundMasterSkill(target, now, distance)) return;
    if (maybeUseAIHammererSkill(target, now, distance)) return;
    maybeUseAILanternKeeperSkill(target, now, distance);
    maybeUseAIGhostfire(target, now, distance);
    maybeUseAISoulBinderSkill(target, now, distance);
    if (maybeUseAIEdictorSkill(target, now, distance)) return;
    if (maybeUseAIDancerSkill(target, now, distance)) return;
    if (maybeUseAIMirrorGhostSkill(target, now, distance)) return;
    if (maybeUseAITwinSwordSkill(target, now, distance)) return;
    if (!isActorDecoyTarget(target) && maybeStartAISawDash(target, now, distance)) return;
    if (maybeUseAIHunterAssist(target, now, distance)) return;

    if (isSurvivorInHunterAttackCone(target, AI_HUNTER_ATTACK_INNER_RANGE_MULTIPLIER) && canAttack) {
      startHunterBasicAttackWindup(now);
      return;
    }

    if (now - hunter.lastAttackAt < hunter.attackCooldown * 1000) {
      hunter.status = "cooldown";
    } else {
      hunter.status = "chasing";
    }

    if (distance > hunter.attackRange * AI_HUNTER_ATTACK_INNER_RANGE_MULTIPLIER) {
      moveHunterToward(dt, now, target);
    }
  }

  function updateAIHunter(now) {
    if (now - lastAIHunterUpdateAt < AI_HUNTER_UPDATE_INTERVAL) return;
    const aiDt = Math.min(0.07, Math.max(0.001, (now - lastAIHunterUpdateAt) / 1000));
    lastAIHunterUpdateAt = now;
    if (isFighterArenaActive()) {
      updateAIHunterInFighterArena(aiDt, now);
      return;
    }
    updateHunter(aiDt, now);
  }

  function updateAIHunterInFighterArena(dt, now) {
    const fighter = fighterArena.fighter;
    if (!fighter || fighter.state !== "healthy" && fighter.state !== "injured") {
      finishFighterArena("fighterDefeated", now);
      return;
    }
    if (isFighterArenaPreparing(now)) {
      hunter.vx = 0;
      hunter.vy = 0;
      fighter.vx = 0;
      fighter.vy = 0;
      hunter.status = "准备";
      return;
    }
    if (updateActorAction(hunter, now)) return;
    if (now < hunter.stunnedUntil) {
      hunter.status = "stunned";
      return;
    }
    if (now < hunter.wipeUntil) {
      hunter.status = hunter.lastAttackHit ? "wipe" : "miss";
      return;
    }
    hunter.target = fighter;
    hunter.lastKnownTargetX = fighter.x;
    hunter.lastKnownTargetY = fighter.y;
    const dx = fighter.x - hunter.x;
    const dy = fighter.y - hunter.y;
    const distance = Math.hypot(dx, dy);
    hunter.angle = turnToward(hunter.angle, Math.atan2(dy, dx), hunter.turnSpeed * dt);
    if (distance > Math.max(hunter.attackRange * 1.75, FIGHTER_ARENA_STEP_DISTANCE * 1.25) && useFighterArenaStep(hunter, now)) return;
    if (isSurvivorInHunterAttackCone(fighter, AI_HUNTER_ATTACK_INNER_RANGE_MULTIPLIER) && canHunterAttack(now)) {
      startHunterBasicAttackWindup(now);
      return;
    }
    hunter.status = "chasing";
    if (distance > hunter.attackRange * AI_HUNTER_ATTACK_INNER_RANGE_MULTIPLIER) {
      moveActorToPoint(hunter, fighter.x, fighter.y, getHunterMoveSpeed(), dt, now);
    }
  }

  function maybeUseAIHunterExcitement(now) {
    if (selectedRole === PLAYER_ROLE.hunter || hunter.assistSkill !== "excitement") return false;
    if (now < (hunter.fighterArenaStunUntil || 0)) return false;
    if (now >= (hunter.stunnedUntil || 0) || !canUseAssistExcitement(now)) return false;
    return useAssistExcitement(now);
  }

  function canUseAIHunterAssist(now) {
    return matchStarted &&
      selectedRole !== PLAYER_ROLE.hunter &&
      Boolean(hunter.assistSkill) &&
      !isInfiniteSawboneMode() &&
      !hunter.action &&
      !hunter.carrying &&
      now >= hunter.stunnedUntil &&
      now >= hunter.wipeUntil &&
      now >= (hunter.sawAttackLockedUntil || 0) &&
      now >= (hunter.nextAssistAt || 0);
  }

  function maybeUseAIHunterAssist(target, now, distance) {
    if (!target || !canUseAIHunterAssist(now)) return false;
    const interacting = Boolean(target.action && ["repairing", "openingGate", "healing", "rescuing", "dismantlingLamp", "dismantlingPeeper"].includes(target.action.kind));

    if (hunter.assistSkill === "listen") {
      if (distance > 340 && getSurvivors().some((survivor) => Math.hypot(survivor.vx || 0, survivor.vy || 0) >= ASSIST_LISTEN_MOVE_THRESHOLD)) {
        useAssistListen(now);
        return true;
      }
      return false;
    }

    if (hunter.assistSkill === "peeper") {
      const wardNearby = assistPeeperWards.some((ward) => now < ward.until && distanceBetween(hunter, ward) < 96);
      if (!wardNearby && distance <= ASSIST_PEEPER_RANGE * 0.9 && (interacting || distance < 150)) {
        useAssistPeeper(now);
        return true;
      }
      return false;
    }

    if (hunter.assistSkill === "abnormal") {
      const point = findNearestAbnormalRepairPoint(hunter, ASSIST_ABNORMAL_RANGE);
      if (point && (target.action && target.action.kind === "repairing" || distance > 260)) return useAssistAbnormal(now);
      return false;
    }

    if (hunter.assistSkill === "patroller") {
      if (distance >= 110 && distance <= 460) {
        useAssistPatroller(now);
        if (activePatroller) activePatroller.target = target;
        return true;
      }
      return false;
    }

    if (hunter.assistSkill === "blink") {
      if (distance >= 250 && distance <= ASSIST_BLINK_DISTANCE + 110 && !isHunterDisplacementBlocked(now)) {
        hunter.angle = Math.atan2(target.y - hunter.y, target.x - hunter.x);
        useAssistBlink(now);
        return true;
      }
    }
    return false;
  }

  function updateAIPatroller(dt, now) {
    if (!activePatroller || selectedRole === PLAYER_ROLE.hunter) return false;
    if (now >= activePatroller.until) {
      activePatroller = null;
      return false;
    }
    const target = isValidHunterChaseTarget(activePatroller.target, now)
      ? activePatroller.target
      : chooseHunterTarget();
    hunter.vx = 0;
    hunter.vy = 0;
    hunter.status = "patrolling";
    if (!target) return true;
    activePatroller.target = target;
    activePatroller.angle = Math.atan2(target.y - activePatroller.y, target.x - activePatroller.x);
    moveActorSmart(
      activePatroller,
      Math.cos(activePatroller.angle) * ASSIST_PATROLLER_SPEED * dt,
      Math.sin(activePatroller.angle) * ASSIST_PATROLLER_SPEED * dt
    );
    return true;
  }

  function handlePlayerAttack(now) {
    if (!matchStarted || selectedRole !== PLAYER_ROLE.hunter) return;
    if (!canHunterAttack(now)) return;
    startHunterBasicAttackWindup(now);
  }

  function startHunterBasicAttackWindup(now) {
    if (!canHunterAttack(now)) return false;
    hunter.status = "attacking";
    hunter.lastAttackHit = false;
    hunter.vx = 0;
    hunter.vy = 0;
    hunter.path = [];
    hunter.pathGoal = null;
    hunter.action = {
      kind: "attackWindup",
      start: now,
      until: now + getHunterAttackWindupDuration(),
      releaseStart: now,
      lastUpdate: now,
      angle: hunter.angle || 0,
      distance: 0,
      lungeDistance: getHunterAttackLungeDistance(),
      balloonAttack: Boolean(hunter.carrying),
      charging: false,
      releasing: true
    };
    chasePulseUntil = now + 180;
    return true;
  }

  function startHunterAttackPress(now) {
    if (!matchStarted || selectedRole !== PLAYER_ROLE.hunter) return;
    if (hunter.assistSkill === "blink" && canUseHunterAssist(now) && !findHunterAttackTarget()) {
      hunter.pendingBlinkAttackUntil = now + ASSIST_BLINK_ATTACK_BUFFER;
      lanternAlert = {
        kind: "assist",
        text: "闪现蓄刀",
        until: now + 900
      };
      return;
    }
    if (!canHunterAttack(now)) return;
    hunter.status = "attacking";
    hunter.lastAttackHit = false;
    hunter.vx = 0;
    hunter.vy = 0;
    hunter.action = {
      kind: "attackWindup",
      start: now,
      until: now + getHunterAttackWindupDuration(),
      lastUpdate: now,
      angle: hunter.angle || 0,
      distance: 0,
      lungeDistance: getHunterAttackLungeDistance(),
      balloonAttack: Boolean(hunter.carrying),
      charging: true,
      releasing: false
    };
    chasePulseUntil = now + 180;
  }

  function releaseHunterAttackPress(now) {
    if (selectedRole !== PLAYER_ROLE.hunter) return;
    const action = hunter.action;
    if (!action || action.kind !== "attackWindup" || !action.charging) return;
    const held = now - action.start;
    if (held < CHARGED_ATTACK_HOLD_THRESHOLD) {
      finishBasicHunterAttackWindup(action, now);
      return;
    }
    finishChargedHunterAttack(action, now, held);
  }

  function finishBasicHunterAttackWindup(action, now) {
    const windupDuration = getHunterAttackWindupDuration();
    action.charging = false;
    action.releasing = true;
    action.releaseStart = action.start;
    action.until = Math.max(now, action.start + windupDuration);
    action.lastUpdate = now;
    action.distance = 0;
    action.angle = hunter.angle || action.angle;
    action.rangeMultiplier = 1;
  }

  function finishChargedHunterAttack(action, now, held) {
    action.charging = false;
    action.releasing = true;
    action.releaseStart = now;
    action.until = now + getHunterAttackWindupDuration();
    action.lastUpdate = now;
    action.distance = 0;
    action.angle = hunter.angle || action.angle;
    action.rangeMultiplier = getChargedAttackRangeMultiplier(held);
  }

  function getChargedAttackRangeMultiplier(held) {
    const capped = Math.max(CHARGED_ATTACK_HOLD_THRESHOLD, Math.min(held, CHARGED_ATTACK_MAX_HOLD));
    const span = Math.max(1, CHARGED_ATTACK_MAX_HOLD - CHARGED_ATTACK_HOLD_THRESHOLD);
    const ratio = (capped - CHARGED_ATTACK_HOLD_THRESHOLD) / span;
    const effectiveRatio = 0.35 + ratio * 0.65;
    return 1 + (CHARGED_ATTACK_RANGE_MULTIPLIER - 1) * effectiveRatio;
  }

  function canUseHunterAssist(now) {
    if (hunter.assistSkill === "excitement") return canUseAssistExcitement(now);
    return matchStarted &&
      selectedRole === PLAYER_ROLE.hunter &&
      Boolean(hunter.assistSkill) &&
      !isInfiniteSawboneMode() &&
      !hunter.action &&
      !hunter.carrying &&
      now >= hunter.stunnedUntil &&
      now >= hunter.wipeUntil &&
      now >= (hunter.sawAttackLockedUntil || 0) &&
      now >= (hunter.nextAssistAt || 0);
  }

  function handleHunterAssist(now) {
    if (hunter.assistSkill === "excitement") {
      useAssistExcitement(now);
      return;
    }
    if (activePatroller) {
      activePatroller = null;
      return;
    }
    if (hunter.assistSkill === "shift" && activeShiftPortals) {
      showAssistAlert("移形门收回", now, 1000);
      finishAssistShift(now);
      return;
    }
    if (!canUseHunterAssist(now)) return;
    if (hunter.assistSkill === "listen") useAssistListen(now);
    else if (hunter.assistSkill === "peeper") useAssistPeeper(now);
    else if (hunter.assistSkill === "abnormal") useAssistAbnormal(now);
    else if (hunter.assistSkill === "patroller") useAssistPatroller(now);
    else if (hunter.assistSkill === "blink") {
      if (isHunterDisplacementBlocked(now)) showAssistAlert("幻香封锁位移", now, 900);
      else useAssistBlink(now);
    } else if (hunter.assistSkill === "shift") {
      if (isHunterDisplacementBlocked(now)) showAssistAlert("幻香封锁位移", now, 900);
      else useAssistShift(now);
    }
  }

  function canUseAssistExcitement(now) {
    if (!matchStarted || hunter.assistSkill !== "excitement" || isInfiniteSawboneMode()) return false;
    if (now < (hunter.nextAssistAt || 0)) return false;
    if (now < (hunter.stunnedUntil || 0)) return true;
    return !hunter.action && now >= (hunter.wipeUntil || 0) && now >= (hunter.sawAttackLockedUntil || 0);
  }

  function setHunterAssistCooldown(now) {
    const config = getHunterAssistConfig();
    hunter.nextAssistAt = now + (config ? config.cooldown : 0);
  }

  function showAssistAlert(text, now, duration = 1300) {
    lanternAlert = {
      kind: "assist",
      text,
      until: now + duration
    };
    chasePulseUntil = now + 300;
  }

  function revealSurvivorByAssist(survivor, now, duration = 3600) {
    survivor.assistRevealUntil = Math.max(survivor.assistRevealUntil || 0, now + duration);
  }

  function useAssistListen(now) {
    let revealed = 0;
    assistListenTargets = [];
    getSurvivors().forEach((survivor) => {
      if (survivor.escaped || survivor.state === "eliminated" || survivor.state === "seated") return;
      const moving = Math.hypot(survivor.vx || 0, survivor.vy || 0) >= ASSIST_LISTEN_MOVE_THRESHOLD;
      const interacting = Boolean(survivor.action && ["repairing", "openingGate", "healing", "rescuing", "dismantlingLamp", "dismantlingPeeper", "vaulting", "droppingPallet"].includes(survivor.action.kind));
      if (!moving && !interacting) return;
      survivor.listenRevealUntil = now + ASSIST_LISTEN_DURATION;
      assistListenTargets.push({ survivor, until: now + ASSIST_LISTEN_DURATION });
      revealed += 1;
    });
    hunter.assistListenUntil = now + ASSIST_LISTEN_DURATION;
    setHunterAssistCooldown(now);
    trackHunterSkillUseUnlock(now);
    showAssistAlert(revealed > 0 ? `聆听发现 ${revealed} 人` : "聆听无人活动", now);
  }

  function useAssistPeeper(now) {
    assistPeeperWards.push({
      id: assistPeeperId += 1,
      x: hunter.x,
      y: hunter.y,
      radius: 12,
      until: now + ASSIST_PEEPER_DURATION,
      triggered: Object.create(null)
    });
    setHunterAssistCooldown(now);
    trackHunterSkillUseUnlock(now);
    showAssistAlert("插眼", now);
  }

  function useAssistAbnormal(now) {
    const point = findNearestAbnormalRepairPoint(hunter, ASSIST_ABNORMAL_RANGE);
    if (!point) {
      showAssistAlert("附近无可失常密码机", now, 900);
      return false;
    }
    hunter.angle = Math.atan2(point.y - hunter.y, point.x - hunter.x);
    hunter.status = "abnormal";
    hunter.vx = 0;
    hunter.vy = 0;
    hunter.action = {
      kind: "abnormalAttack",
      start: now,
      until: now + ASSIST_ABNORMAL_WINDUP,
      point
    };
    setHunterAssistCooldown(now);
    trackHunterSkillUseUnlock(now);
    showAssistAlert("失常挥刀", now, 900);
    return true;
  }

  function findNearestAbnormalRepairPoint(actor, range) {
    let nearest = null;
    let nearestDistance = Infinity;
    repairPoints.forEach((point) => {
      if (point.completed || (point.progress || 0) <= 0) return;
      const distance = distanceBetween(actor, point);
      if (distance < range && distance < nearestDistance) {
        nearest = point;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function finishAssistAbnormal(action, now) {
    const point = action && action.point;
    if (!point || point.completed) return;
    const uses = Math.max(0, point.abnormalUses || 0);
    const loss = Math.max(ASSIST_ABNORMAL_MIN_LOSS, ASSIST_ABNORMAL_FIRST_LOSS - uses * ASSIST_ABNORMAL_LOSS_STEP);
    point.progress = Math.max(0, (point.progress || 0) - loss);
    point.abnormalUses = uses + 1;
    point.abnormalDecayUntil = now + ASSIST_ABNORMAL_DECAY_DURATION;
    point.nextAbnormalDecayAt = now + ASSIST_ABNORMAL_DECAY_INTERVAL;
    chasePulseUntil = now + 420;
    showAssistAlert(`失常 -${Math.round(loss * 100)}% + 持续退机`, now, 1100);
  }

  function useAssistPatroller(now) {
    activePatroller = {
      x: hunter.x,
      y: hunter.y,
      radius: 14,
      angle: hunter.angle,
      until: now + ASSIST_PATROLLER_DURATION
    };
    setHunterAssistCooldown(now);
    trackHunterSkillUseUnlock(now);
    showAssistAlert("巡视者出动", now);
  }

  function useAssistBlink(now) {
    const destination = getBlinkDestination();
    const dx = destination.x - hunter.x;
    const dy = destination.y - hunter.y;
    const distance = Math.hypot(dx, dy);
    if (distance > 8) hunter.angle = Math.atan2(dy, dx);
    const blinked = moveHunterByBlink(destination);
    hunter.vx = 0;
    hunter.vy = 0;
    setHunterAssistCooldown(now);
    trackHunterSkillUseUnlock(now);
    hunter.blinkDownEligibleUntil = blinked > 8 ? now + ASSIST_BLINK_DOWN_WINDOW : 0;
    if (blinked > 0 && now <= (hunter.pendingBlinkAttackUntil || 0) && canHunterAttack(now)) {
      startHunterBasicAttackWindup(now);
    } else {
      showAssistAlert("闪现", now);
    }
    hunter.pendingBlinkAttackUntil = 0;
  }

  function useAssistExcitement(now) {
    if (!canUseAssistExcitement(now)) return false;
    if (now < (hunter.stunnedUntil || 0)) {
      hunter.stunnedUntil = 0;
      hunter.status = "chasing";
      hunter.path = [];
      hunter.pathGoal = null;
      hunter.vx = 0;
      hunter.vy = 0;
      showAssistAlert("兴奋解除眩晕", now, 1000);
    } else {
      hunter.excitementGuardUntil = now + EXCITEMENT_GUARD_DURATION;
      showAssistAlert("兴奋免控", now, 1000);
    }
    setHunterAssistCooldown(now);
    trackHunterSkillUseUnlock(now);
    return true;
  }

  function getShiftDestination() {
    const target = getAimTargetFromPointer(null, null, true) || {
      x: hunter.x + Math.cos(hunter.angle) * ASSIST_SHIFT_RANGE,
      y: hunter.y + Math.sin(hunter.angle) * ASSIST_SHIFT_RANGE
    };
    const dx = target.x - hunter.x;
    const dy = target.y - hunter.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 1) return findNearestSafePosition(hunter.x, hunter.y, hunter.radius);
    const scale = Math.min(ASSIST_SHIFT_RANGE, distance) / distance;
    return findNearestSafePosition(
      hunter.x + dx * scale,
      hunter.y + dy * scale,
      hunter.radius
    );
  }

  function useAssistShift(now) {
    if (activeShiftPortals) return;
    const near = findNearestSafePosition(hunter.x, hunter.y, hunter.radius);
    const far = getShiftDestination();
    if (distanceBetween(near, far) < ASSIST_SHIFT_RADIUS * 2) {
      showAssistAlert("移形距离太近", now);
      return;
    }
    activeShiftPortals = {
      near,
      far,
      usesLeft: ASSIST_SHIFT_USES,
      until: now + ASSIST_SHIFT_DURATION,
      lockoutUntil: now + ASSIST_SHIFT_LOCKOUT,
      armed: false
    };
    trackHunterSkillUseUnlock(now);
    showAssistAlert("移形门开启", now);
  }

  function finishAssistShift(now) {
    if (!activeShiftPortals) return;
    activeShiftPortals = null;
    setHunterAssistCooldown(now);
  }

  function getShiftPortalExit(portal) {
    if (!activeShiftPortals) return null;
    if (portal === activeShiftPortals.near) return activeShiftPortals.far;
    if (portal === activeShiftPortals.far) return activeShiftPortals.near;
    return null;
  }

  function teleportHunterThroughShiftPortal(portal, now) {
    const exit = getShiftPortalExit(portal);
    if (!exit || !activeShiftPortals) return;
    const angle = Math.atan2(exit.y - portal.y, exit.x - portal.x);
    const safe = findNearestSafePosition(
      exit.x + Math.cos(angle) * (ASSIST_SHIFT_RADIUS + hunter.radius + 8),
      exit.y + Math.sin(angle) * (ASSIST_SHIFT_RADIUS + hunter.radius + 8),
      hunter.radius
    );
    hunter.x = safe.x;
    hunter.y = safe.y;
    hunter.vx = 0;
    hunter.vy = 0;
    hunter.path = [];
    hunter.pathGoal = null;
    hunter.repathAt = 0;
    hunter.angle = angle;
    activeShiftPortals.usesLeft -= 1;
    activeShiftPortals.lockoutUntil = now + ASSIST_SHIFT_LOCKOUT;
    activeShiftPortals.armed = false;
    showAssistAlert(`移形 ${activeShiftPortals.usesLeft}/${ASSIST_SHIFT_USES}`, now, 900);
    if (activeShiftPortals.usesLeft <= 0) finishAssistShift(now);
  }

  function handlePlayerSkill(now) {
    if (selectedRole === PLAYER_ROLE.hunter && isFighterArenaParticipant(hunter)) return;
    if (selectedRole === PLAYER_ROLE.survivor && isFighterArenaParticipant(player)) return;
    if (selectedRole === PLAYER_ROLE.hunter && isHoundMaster()) {
      releaseHound(now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.hunter && isHammerer()) {
      startHammerShock(now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.hunter && isEdictor()) {
      placeEdictTrap(now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.survivor && (now < (player.edictStunnedUntil || 0) || now < (player.houndStunnedUntil || 0))) return;
    if (selectedRole === PLAYER_ROLE.survivor && canUseShieldGuard(player, now)) {
      useShieldGuard(player, now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.survivor && canUseTunerCipherTune(player)) {
      useTunerCipherTune(player, now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.survivor && canUseTunerEcho(player, now)) {
      useTunerEcho(player, now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.survivor && canUseGeneralSkill(player, now)) {
      useGeneralSkill(player, now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.survivor && canUseMedicAdrenaline(player, now)) {
      useMedicAdrenaline(player, now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.survivor && canStartFighterArena(player, now)) {
      startFighterArena(player, now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.survivor && canStartFencerLunge(player, now)) {
      startFencerLunge(player, now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.survivor && canUsePerfumeMist(player, now)) {
      usePerfumeSkill(player, now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.survivor && canUseMagicShow(player, now)) {
      performMagicShow(player, now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.survivor && canActivateTimeRewind(player, now)) {
      activateTimeRewind(player, now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.survivor && canPlaceTimeDevice(player, now)) {
      placeTimeDevice(player, now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.survivor && canThrowPackage(player, now)) {
      throwPackage(player, player.angle, now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.survivor && canPlaceStitchPack(player)) {
      placeStitchPack(player, now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.hunter && canStartSawDash(now)) {
      startSawDash(now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.hunter && isDancer()) {
      startDancePointAim(now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.hunter && isTwinSword()) {
      switchTwinForm(now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.hunter && isSoulBinder()) {
      startSoulSiphonSelection(now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.hunter && isMirrorGhost()) {
      startMirrorCurtainAim(now);
      return;
    }
    if (canRecallSoulLamp(now)) {
      recallSoulLamp(findNearestSoulLamp(hunter, SOUL_LAMP_RECALL_RANGE), now);
      return;
    }
    if (canPlaceSoulLamp(now)) {
      placeSoulLamp(now);
      return;
    }
  }

  function handlePlayerShadowSkill(now) {
    if (selectedRole === PLAYER_ROLE.survivor && isActor(player)) {
      toggleMagicShowMode(player);
      return;
    }
    if (selectedRole === PLAYER_ROLE.hunter && isDancer()) {
      useInfiniteDance(now);
      return;
    }
    if (canShadowTeleport(now)) {
      shadowTeleportToSoulLamp(now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.hunter && isSoulBinder()) {
      useSoulPatrol(now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.hunter && isAbyss()) {
      useAbyssWhisper(now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.hunter && isTwinSword()) {
      fireTwinFlyingSword(now);
    }
  }

  function canHunterAttack(now) {
    return !hunter.action &&
      !isFighterArenaPreparing(now) &&
      getFighterArenaStepCooldownLeft(hunter, now) <= 0 &&
      !isTwinForm(TWIN_FORM_CHIYIN) &&
      now >= (hunter.invisibleUntil || 0) &&
      now >= hunter.stunnedUntil &&
      now >= (hunter.stopAttackUntil || 0) &&
      now >= hunter.wipeUntil &&
      now >= (hunter.sawAttackLockedUntil || 0) &&
      now - hunter.lastAttackAt >= hunter.attackCooldown * 1000;
  }

  function performHunterAttack(now) {
    commitHunterAttack(now);
    resolveHunterAttack({
      balloonAttack: Boolean(hunter.carrying),
      rangeMultiplier: 1
    }, now);
  }

  function commitHunterAttack(now) {
    hunter.lastAttackAt = now;
    hunter.status = "attacking";
    hunter.lastAttackHit = false;
    hunter.vx = 0;
    hunter.vy = 0;
    if (isTwinSword() && now < (hunter.twinEnlightenedUntil || 0)) {
      hunter.twinFlyingSwords = (hunter.twinFlyingSwords || 0) + 1;
    }
  }

  function resolveHunterAttack(action, now) {
    const target = findHunterAttackTarget(action.rangeMultiplier || 1) || findSeatedHunterAttackTarget(action.rangeMultiplier || 1);
    const isBalloonAttack = Boolean(action.balloonAttack && hunter.carrying);
    hunter.action = null;
    hunter.status = "attacking";
    hunter.lastAttackHit = Boolean(target);
    chasePulseUntil = now + 280;

    if (target) {
      if (target.state === "seated") {
        hunter.wipeUntil = isBalloonAttack ? now : now + getHunterHitRecoveryDuration();
        return;
      }
      if (isActorDecoyTarget(target)) {
        breakActorDecoy(target, now);
        hunter.wipeUntil = isBalloonAttack ? now : now + getHunterHitRecoveryDuration();
        return;
      }
      if (isSurvivorInvulnerable(target, now)) {
        hunter.lastAttackHit = false;
        hunter.wipeUntil = now + getHunterMissRecoveryDuration();
        if (isFlywheelActive(target, now)) showAssistAlert("飞轮规避普攻", now, 650);
        return;
      }
      addHunterPresenceHit(now);
      const arenaHit = isFighterArenaActive() && target === fighterArena.fighter;
      const absorbedByShield = applyHunterHit(target, now, {
        applyBoneBleed: isSawbone(),
        detentionDown: isDetentionActive(),
        damage: getHunterBasicAttackDamage(),
        basicAttack: true
      });
      if (arenaHit) {
        hunter.wipeUntil = now + getHunterHitRecoveryDuration();
        hunter.status = "wipe";
        return;
      }
      if (now < (hunter.stunnedUntil || 0) || absorbedByShield) return;
      hunter.wipeUntil = isBalloonAttack ? now : now + getHunterHitRecoveryDuration();
      return;
    }

    hunter.wipeUntil = now + getHunterMissRecoveryDuration();
  }

  function maybeStartAISawDash(target, now, distance) {
    if (!target || selectedRole === PLAYER_ROLE.hunter || !canStartSawDash(now)) return false;
    if (hunter.carrying) return false;
    const config = getSawDashConfig(canUseShortSaw(now));
    if (distance < hunter.attackRange * 0.8 || distance > config.range * 0.9) return false;
    if (!hasWalkableLine(hunter.x, hunter.y, target.x, target.y, hunter.radius)) return false;
    startSawDash(now, target);
    return true;
  }

  function maybeUseAIHoundMasterSkill(target, now, distance) {
    if (selectedRole === PLAYER_ROLE.hunter || !isHoundMaster() || !target || isActorDecoyTarget(target)) return false;
    if (!canReleaseHound(now) || distance < 150 || distance > HOUND_TARGET_RANGE) return false;
    return releaseHound(now);
  }

  function maybeUseAIHammererSkill(target, now, distance) {
    if (selectedRole === PLAYER_ROLE.hunter || !isHammerer() || !target || isActorDecoyTarget(target)) return false;
    if (!canStartHammerShock(now) || distance < 82 || distance > 430) return false;
    const maxLeap = hunter.presenceTier >= 2 ? HAMMER_TIER_TWO_MAX_LEAP_DISTANCE : HAMMER_MAX_LEAP_DISTANCE;
    const usefulLeap = Math.max(HAMMER_MIN_LEAP_DISTANCE, Math.min(maxLeap, distance - HAMMER_MIN_IMPACT_RANGE * 0.55));
    const chargeRatio = Math.max(0, Math.min(1, (usefulLeap - HAMMER_MIN_LEAP_DISTANCE) / Math.max(1, maxLeap - HAMMER_MIN_LEAP_DISTANCE)));
    const autoReleaseAt = now + HAMMER_MIN_CHARGE + (HAMMER_MAX_CHARGE - HAMMER_MIN_CHARGE) * chargeRatio;
    return startHammerShock(now, autoReleaseAt);
  }

  function canAIPlaceSoulLamp(now) {
    return matchStarted &&
      selectedRole !== PLAYER_ROLE.hunter &&
      isLanternKeeper() &&
      !hunter.action &&
      !hunter.carrying &&
      now >= hunter.stunnedUntil &&
      now >= hunter.wipeUntil &&
      now >= nextSoulLampAt &&
      soulLamps.length < getSoulLampLimit();
  }

  function maybeUseAILanternKeeperSkill(target, now, distance) {
    if (!target || isActorDecoyTarget(target) || !canAIPlaceSoulLamp(now)) return false;
    const targetPressured = distance < SOUL_LAMP_RANGE * 1.7;
    const objectivePressure = target.action && ["repairing", "openingGate", "rescuing", "healing", "dismantlingLamp"].includes(target.action.kind);
    if (!targetPressured && !objectivePressure) return false;
    const nearbyLamp = soulLamps.some((lamp) => {
      return distanceBetween(lamp, hunter) < SOUL_LAMP_RANGE * 0.72 ||
        distanceBetween(lamp, target) < SOUL_LAMP_RANGE * 0.86;
    });
    if (nearbyLamp) return false;
    placeSoulLamp(now);
    return true;
  }

  function maybeUseAIGhostfire(target, now, distance) {
    if (selectedRole === PLAYER_ROLE.hunter || !target || isActorDecoyTarget(target) || !canUseGhostfire(now)) return false;
    if (!soulLamps.some((lamp) => distanceBetween(lamp, target) <= GHOSTFIRE_RANGE)) return false;
    return useGhostfire(now);
  }

  function maybeUseAISoulBinderSkill(target, now, distance) {
    if (selectedRole === PLAYER_ROLE.hunter || !isSoulBinder() || hunter.carrying || hunter.action) return false;
    if (canActivateSoulPatrolFloat(now)) return activateSoulPatrolFloat(now);
    if (tryAISoulPatrol(now)) return true;
    if (target && !isActorDecoyTarget(target) && tryAISoulSiphon(target, now, distance)) return true;
    return tryAIBorrowSoul(target, now, distance);
  }

  function tryAISoulPatrol(now) {
    if (!canStartSoulPatrol(now)) return false;
    const point = repairPoints
      .filter((candidate) => !candidate.completed)
      .sort((a, b) => {
        const workerDelta = (b.workers || []).length - (a.workers || []).length;
        if (workerDelta !== 0) return workerDelta;
        return (b.progress || 0) - (a.progress || 0);
      })[0];
    if (!point || distanceBetween(hunter, point) < 260) return false;
    return startSoulPatrol(now, point);
  }

  function tryAISoulSiphon(target, now, distance) {
    if (!canStartSoulSiphon(now)) return false;
    const siphonTarget = getAISoulSiphonTarget(target);
    if (!siphonTarget) return false;
    const targetDistance = distanceBetween(hunter, siphonTarget);
    if (targetDistance < AI_SOUL_SIPHON_MIN_RANGE || targetDistance > AI_SOUL_SIPHON_MAX_RANGE) return false;
    if (siphonTarget !== target && distance < hunter.attackRange * 1.35) return false;
    return startSoulSiphon(siphonTarget, now);
  }

  function getAISoulSiphonTarget(target) {
    if (target && !target.escaped && target.state !== "eliminated" && getSoulMarks(target) > 0) return target;
    return getSurvivors()
      .filter((survivor) => !survivor.escaped && survivor.state !== "eliminated" && survivor.state !== "seated" && survivor.state !== "carried" && getSoulMarks(survivor) > 0)
      .sort((a, b) => {
        const markDelta = getSoulMarks(b) - getSoulMarks(a);
        if (markDelta !== 0) return markDelta;
        return distanceBetween(hunter, a) - distanceBetween(hunter, b);
      })[0] || null;
  }

  function tryAIBorrowSoul(target, now, distance) {
    if (!canBorrowSoul(now) || now < (hunter.borrowSoulUntil || 0)) return false;
    const total = getTotalSoulMarks();
    if (total <= 0) return false;
    const enoughStoredPower = total >= 5;
    const chaseNeedsBoost = target && distance > hunter.attackRange * 1.7 && distance < 680 && total >= 2;
    if (!enoughStoredPower && !chaseNeedsBoost) return false;
    return borrowSoul(now);
  }

  function maybeUseAIMirrorGhostSkill(target, now, distance) {
    if (selectedRole === PLAYER_ROLE.hunter || !isMirrorGhost() || hunter.carrying || hunter.action || isActorDecoyTarget(target)) return false;
    if (tryAIMirrorLight(now)) return true;
    tryAIMirrorCurtain(target, now, distance);
    return false;
  }

  function maybeUseAITwinSwordSkill(target, now, distance) {
    if (selectedRole === PLAYER_ROLE.hunter || !isTwinSword() || hunter.carrying || hunter.action || isActorDecoyTarget(target)) return false;
    if (!canUseTwinSwordSkill(now)) return false;
    const aim = {
      targetX: target.x + (target.vx || 0) * 0.18,
      targetY: target.y + (target.vy || 0) * 0.18,
      pointerId: null
    };
    if ((hunter.twinFlyingSwords || 0) > 0 && distance > 210 && distance < TWIN_FLYING_SWORD_RANGE && hasWalkableLine(hunter.x, hunter.y, target.x, target.y, hunter.radius)) {
      return fireTwinFlyingSword(now, aim);
    }
    if (hunter.presenceTier >= 1 && canActivateTwinDualCast(now) && distance < 460 && Math.random() < 0.14) {
      return activateTwinDualCast(now);
    }
    if (isTwinForm(TWIN_FORM_QINGTIAN)) {
      if (!hunter.twinTimePower && (hunter.twinIntent || 0) >= TWIN_TIME_POWER_COST && distance < 560) {
        hunter.twinTimeMode = "self";
        return castTwinTimePower(now);
      }
      if ((hunter.twinIntent || 0) >= TWIN_SPACE_POWER_COST && distance > 310 && distance < TWIN_SPACE_POWER_RANGE && hasWalkableLine(hunter.x, hunter.y, target.x, target.y, hunter.radius)) {
        return castTwinSpacePower(aim, now);
      }
      if (now >= (hunter.nextTwinFormAt || 0) && (distance > 470 || !hasWalkableLine(hunter.x, hunter.y, target.x, target.y, hunter.radius))) {
        return switchTwinForm(now);
      }
      return false;
    }
    if (distance < TWIN_SHADOW_LOCK_CAST_RANGE && now >= (hunter.nextTwinShadowLockAt || 0)) {
      return castTwinShadowLock(aim, now);
    }
    if (distance < TWIN_SHADOW_STRIKE_CAST_RANGE && now >= (hunter.nextTwinShadowStrikeAt || 0)) {
      return castTwinShadowStrike(aim, now);
    }
    if (now >= (hunter.nextTwinFormAt || 0) && distance < 300) return switchTwinForm(now);
    return false;
  }

  function maybeUseAIDancerSkill(target, now, distance) {
    if (selectedRole === PLAYER_ROLE.hunter || !isDancer() || hunter.carrying || hunter.action || isActorDecoyTarget(target)) return false;
    if (canUseInfiniteDance(now) && distance > 180 && distance < 560 && (danceLines.length > 0 || pendingDancePoint)) {
      return useInfiniteDance(now);
    }
    if (hunter.presenceTier >= 1 && canUseDanceSpin(now) && distance > 260 && distance < 640 && Math.random() < 0.16) {
      return useDanceSpin(now);
    }
    if (!canStartDanceStep(now) || distance < AI_DANCE_STEP_MIN_RANGE || distance > AI_DANCE_STEP_MAX_RANGE) return false;
    if (!hasWalkableLine(hunter.x, hunter.y, target.x, target.y, hunter.radius)) return false;
    return startDanceStep(target.x, target.y, now);
  }

  function maybeUseAIEdictorSkill(target, now, distance) {
    if (selectedRole === PLAYER_ROLE.hunter || !isEdictor() || hunter.carrying || hunter.action || isActorDecoyTarget(target)) return false;
    if (canUseEdictHook(now) && distance > 150 && distance < EDICTOR_HOOK_RANGE && hasWalkableLine(hunter.x, hunter.y, target.x, target.y, hunter.radius)) {
      return useEdictHook(now, Math.atan2(target.y - hunter.y, target.x - hunter.x));
    }
    if (canPlaceEdictTrap(now) && distance < 210 && Math.random() < 0.09) return placeEdictTrap(now);
    return false;
  }

  function tryAIMirrorLight(now) {
    if (!canUseMirrorLight(now)) return false;
    const affected = getSurvivors().filter((survivor) => {
      if (survivor.escaped || survivor.state === "downed" || survivor.state === "eliminated" || survivor.state === "seated" || survivor.state === "carried") return false;
      return mirrorRifts.some((rift) => distanceBetween(survivor, rift) <= MIRROR_LIGHT_RADIUS);
    });
    if (affected.length === 0) return false;
    if (affected.length < 2 && distanceBetween(hunter, affected[0]) < hunter.attackRange * 1.25) return false;
    return useMirrorLight(now);
  }

  function tryAIMirrorCurtain(target, now, distance) {
    if (!target || !canAIPlaceMirrorCurtain(now, target, distance)) return false;
    const line = getAIMirrorCurtainLine(target, distance);
    if (!line) return false;
    placeMirrorCurtain(line.start, line.end, now);
    return true;
  }

  function canAIPlaceMirrorCurtain(now, target, distance) {
    if (!target || target.escaped || target.state === "downed" || target.state === "eliminated" || target.state === "seated" || target.state === "carried") return false;
    if (distance < AI_MIRROR_CURTAIN_PLACE_MIN_RANGE || distance > AI_MIRROR_CURTAIN_PLACE_MAX_RANGE) return false;
    if (getMirrorCurtainCooldownLeft(now) > 0 || now < hunter.stunnedUntil || now < hunter.wipeUntil) return false;
    if (!hasWalkableLine(hunter.x, hunter.y, target.x, target.y, hunter.radius)) return false;
    return !mirrorCurtains.some((curtain) => distanceToSegment(target.x, target.y, curtain.x1, curtain.y1, curtain.x2, curtain.y2) <= MIRROR_CURTAIN_MAX_LENGTH * 0.72);
  }

  function getAIMirrorCurtainLine(target, distance) {
    const toTarget = normalizeVector(target.x - hunter.x, target.y - hunter.y);
    if (!toTarget.x && !toTarget.y) return null;
    const normal = { x: -toTarget.y, y: toTarget.x };
    const centerDistance = Math.min(distance * 0.68, distance - 48);
    const center = {
      x: hunter.x + toTarget.x * centerDistance,
      y: hunter.y + toTarget.y * centerDistance
    };
    const halfLength = Math.min(MIRROR_CURTAIN_MAX_LENGTH, AI_MIRROR_CURTAIN_LENGTH) * 0.5;
    const start = {
      x: actorClamp(center.x - normal.x * halfLength, 70, world.width - 70),
      y: actorClamp(center.y - normal.y * halfLength, 70, world.height - 70)
    };
    const end = {
      x: actorClamp(center.x + normal.x * halfLength, 70, world.width - 70),
      y: actorClamp(center.y + normal.y * halfLength, 70, world.height - 70)
    };
    return distanceBetween(start, end) >= MIRROR_CURTAIN_MIN_LENGTH ? { start, end } : null;
  }

  function getSawDashConfig(short = false) {
    if (short) {
      return {
        duration: SHORT_SAW_DURATION,
        range: SHORT_SAW_RANGE,
        turnSpeed: SHORT_SAW_TURN_SPEED,
        noTimeLimit: false,
        noDistanceLimit: false
      };
    }
    const tierTwo = hunter.presenceTier >= 2 || isInfiniteSawboneMode();
    return {
      duration: tierTwo ? SAW_DASH_DURATION + 90 : SAW_DASH_DURATION,
      range: tierTwo ? SAW_DASH_TIER_TWO_RANGE : SAW_DASH_RANGE,
      turnSpeed: tierTwo ? SAW_DASH_TIER_TWO_TURN_SPEED : SAW_DASH_TURN_SPEED,
      noTimeLimit: tierTwo,
      noDistanceLimit: tierTwo,
      durability: null
    };
  }

  function startSawDash(now, target = null) {
    const short = canUseShortSaw(now);
    const config = getSawDashConfig(short);
    if (!short) hunter.nextSawDashAt = isInfiniteSawboneMode() ? now : now + SAW_DASH_COOLDOWN;
    hunter.shortSawAvailableUntil = 0;
    hunter.action = {
      kind: "sawDash",
      start: now,
      until: now + config.duration,
      lastAt: now,
      range: config.range,
      duration: config.duration,
      turnSpeed: config.turnSpeed,
      noTimeLimit: config.noTimeLimit,
      noDistanceLimit: config.noDistanceLimit,
      durability: config.durability,
      short,
      target,
      hit: false,
      traveled: 0
    };
    trackHunterSkillUseUnlock(now);
    hunter.status = short ? "shortSaw" : "sawDash";
    hunter.path = [];
    hunter.pathGoal = null;
    chasePulseUntil = now + 420;
  }

  function updateSawDashAction(action, now) {
    const dt = Math.min(0.033, Math.max(0, (now - (action.lastAt || action.start)) / 1000));
    action.lastAt = now;
    if (dt <= 0) return true;

    const previousAngle = hunter.angle;
    const steerAngle = getSawDashSteerAngle(action);
    if (Number.isFinite(steerAngle)) {
      hunter.angle = turnToward(hunter.angle, steerAngle, action.turnSpeed * dt);
    }

    const speed = action.range / Math.max(action.duration / 1000, 0.001);
    const step = speed * dt;
    const beforeX = hunter.x;
    const beforeY = hunter.y;
    const moved = moveActorSmart(hunter, Math.cos(hunter.angle) * step, Math.sin(hunter.angle) * step);
    action.traveled += moved;
    drainSawDashDurability(action, dt, Math.abs(angleDifference(previousAngle, hunter.angle)), Math.max(0, step - moved));
    hunter.vx = (hunter.x - beforeX) / Math.max(dt, 0.001);
    hunter.vy = (hunter.y - beforeY) / Math.max(dt, 0.001);
    hunter.status = action.short ? "shortSaw" : "sawDash";

    const target = findSawDashHitTarget();
    if (target) {
      if (isActorDecoyTarget(target)) {
        breakActorDecoy(target, now);
        cancelSawDashByControl(now, "幻影断锯");
        return true;
      }
      if (isFlywheelActive(target, now)) {
        cancelSawDashByControl(now, "飞轮断锯");
        return true;
      }
      finishSawDashHit(action, target, now);
      hunter.action = null;
      return true;
    }

    if (moved < step * 0.35 || (Number.isFinite(action.durability) && action.durability <= 0) || (!action.noTimeLimit && now >= action.until) || (!action.noDistanceLimit && action.traveled >= action.range)) {
      hunter.action = null;
      hunter.vx = 0;
      hunter.vy = 0;
      hunter.status = hunter.target ? "chasing" : "ready";
      return true;
    }

    return true;
  }

  function drainSawDashDurability(action, dt, turnAmount, blockedDistance) {
    if (!Number.isFinite(action.durability)) return;
    action.durability -= SAW_DASH_DURABILITY_BASE_DRAIN * dt;
    action.durability -= turnAmount * SAW_DASH_DURABILITY_TURN_DRAIN;
    action.durability -= blockedDistance * SAW_DASH_DURABILITY_SLIDE_DRAIN;
  }

  function getSawDashSteerAngle(action) {
    if (selectedRole === PLAYER_ROLE.hunter) {
      const move = getMoveVector();
      if (move.length > 0.1) return Math.atan2(move.y, move.x);
      return hunter.angle;
    }
    if (action.target && !action.target.escaped && action.target.state !== "eliminated" && !isSurvivorInvisible(action.target) && canAIHunterSeeThroughPerfume(action.target)) {
      return Math.atan2(action.target.y - hunter.y, action.target.x - hunter.x);
    }
    return hunter.angle;
  }

  function findSawDashHitTarget() {
    let best = null;
    let bestDistance = Infinity;
    const targets = getSurvivors().concat(actorDecoys.filter((decoy) => decoy.kind === "actorRescuePhantom"));
    targets.forEach((survivor) => {
      if (survivor.escaped || survivor.state === "downed" || survivor.state === "seated" || survivor.state === "carried" || survivor.state === "eliminated") return;
      if (selectedRole !== PLAYER_ROLE.hunter && !isActorDecoyTarget(survivor) && isSurvivorInvisible(survivor)) return;
      if (selectedRole !== PLAYER_ROLE.hunter && !isActorDecoyTarget(survivor) && !canAIHunterSeeThroughPerfume(survivor)) return;
      const distance = distanceBetween(hunter, survivor);
      if (distance > hunter.radius + survivor.radius + 18) return;
      const targetAngle = Math.atan2(survivor.y - hunter.y, survivor.x - hunter.x);
      if (Math.abs(angleDifference(hunter.angle, targetAngle)) > Math.PI * 0.58) return;
      if (distance < bestDistance) {
        best = survivor;
        bestDistance = distance;
      }
    });
    return best;
  }

  function finishSawDashHit(action, target, now) {
    hunter.sawAttackLockedUntil = Math.max(hunter.sawAttackLockedUntil || 0, now + SAW_DASH_ATTACK_LOCKOUT);
    if (action.short) {
      applyHunterHit(target, now, {
        allowTerrorShock: false,
        applyBoneBleed: false,
        damage: 0.5
      });
    } else {
      addHunterPresenceHit(now);
      applyHunterHit(target, now, { applyBoneBleed: false });
    }
    if (action.short) {
      startSawHitRecovery(now);
    } else if (hunter.presenceTier >= 1) {
      hunter.shortSawAvailableUntil = now + (hunter.presenceTier >= 2 ? SHORT_SAW_TIER_TWO_WINDOW : SHORT_SAW_WINDOW);
      hunter.pendingSawWipe = true;
      hunter.pendingSawWipeAt = hunter.shortSawAvailableUntil;
    } else {
      startSawHitRecovery(now);
    }
    hunter.status = "sawHit";
    chasePulseUntil = now + 480;
  }

  function startSawHitRecovery(now) {
    hunter.pendingSawWipe = false;
    hunter.pendingSawWipeAt = 0;
    hunter.shortSawAvailableUntil = 0;
    hunter.lastAttackHit = true;
    hunter.wipeUntil = now + getHunterHitRecoveryDuration();
    hunter.status = "wipe";
  }

  function updateSawbonePendingWipe(now) {
    if (!hunter.pendingSawWipe) return;
    if (hunter.action || now < hunter.pendingSawWipeAt) return;
    if (now < hunter.stunnedUntil) return;
    startSawHitRecovery(now);
  }

  function addHunterPresenceHit(now) {
    const previousTier = hunter.presenceTier || 0;
    hunter.presenceHits = Math.min(PRESENCE_TIER_TWO_HITS, (hunter.presenceHits || 0) + 1);
    hunter.presenceTier = getPresenceTierFromHits(hunter.presenceHits);
    if (hunter.presenceTier > previousTier) {
      lanternAlert = {
        text: hunter.presenceTier === 1 ? "存在感 一阶" : "存在感 二阶",
        until: now + 1600
      };
      if (hunter.presenceTier >= 1 && previousTier < 1) trackHunterTierOneUnlock(now);
    }
  }

  function getPresenceTierFromHits(hits) {
    if (hits >= PRESENCE_TIER_TWO_HITS) return 2;
    if (hits >= PRESENCE_TIER_ONE_HITS) return 1;
    return 0;
  }

  function findHunterAttackTarget(rangeMultiplier = 1) {
    let best = null;
    let bestDistance = Infinity;
    actorDecoys.forEach((decoy) => {
      if (!isSurvivorInHunterAttackCone(decoy, rangeMultiplier)) return;
      const distance = distanceBetween(hunter, decoy);
      if (distance < bestDistance) {
        best = decoy;
        bestDistance = distance;
      }
    });
    getSurvivors().forEach((survivor) => {
      if (survivor.escaped) return;
      if (survivor.state === "downed" || survivor.state === "seated" || survivor.state === "carried" || survivor.state === "eliminated") return;
      if (selectedRole !== PLAYER_ROLE.hunter && isSurvivorInvisible(survivor)) return;
      if (selectedRole !== PLAYER_ROLE.hunter && !canAIHunterSeeThroughPerfume(survivor)) return;
      if (!isSurvivorInHunterAttackCone(survivor, rangeMultiplier)) return;
      const distance = distanceBetween(hunter, survivor);
      if (distance < bestDistance) {
        best = survivor;
        bestDistance = distance;
      }
    });
    return best;
  }

  function findSeatedHunterAttackTarget(rangeMultiplier = 1) {
    let best = null;
    let bestDistance = Infinity;
    getSurvivors().forEach((survivor) => {
      if (survivor.escaped || survivor.state !== "seated" || !survivor.chair) return;
      if (!isSurvivorInHunterAttackCone(survivor, rangeMultiplier)) return;
      const distance = distanceBetween(hunter, survivor);
      if (distance < bestDistance) {
        best = survivor;
        bestDistance = distance;
      }
    });
    return best;
  }

  function chooseHunterTarget() {
    if (isFighterArenaActive()) return fighterArena.fighter;
    if (selectedRole === PLAYER_ROLE.hunter && isHunterInvisibleToSurvivors()) return null;
    if (isKiteSimulatorMode() && selectedRole === PLAYER_ROLE.survivor) {
      if (!player.escaped && player.state !== "seated" && player.state !== "carried" && player.state !== "eliminated") return player;
      return null;
    }

    const lockedTarget = getValidHunterTargetLock(performance.now());
    if (lockedTarget) return lockedTarget;

    const committedRescueTarget = getCommittedRescueChaseTarget(performance.now());
    if (committedRescueTarget) return committedRescueTarget;

    let best = null;
    let bestScore = Infinity;
    actorDecoys.forEach((decoy) => {
      const owner = decoy.owner;
      if (!owner || owner.escaped || owner.state !== "healthy" && owner.state !== "injured") return;
      const distance = distanceBetween(hunter, decoy);
      const healthPriority = getTargetHealthPriority(owner);
      const chaseDifficulty = getTargetChaseDifficulty(owner);
      const objectivePressure = getTargetObjectivePressure(owner);
      const score = healthPriority * 460 + distance * chaseDifficulty + objectivePressure + Math.random() * 18;
      if (score < bestScore) {
        best = decoy;
        bestScore = score;
      }
    });
    getSurvivors().forEach((survivor) => {
      if (survivor.escaped) return;
      if (survivor.state === "downed" || survivor.state === "seated" || survivor.state === "carried" || survivor.state === "eliminated") return;
      if (isSurvivorInvisible(survivor)) return;
      if (!canAIHunterSeeThroughPerfume(survivor)) return;
      const distance = distanceBetween(hunter, survivor);
      const healthPriority = getTargetHealthPriority(survivor);
      const chaseDifficulty = getTargetChaseDifficulty(survivor);
      const stickiness = getHunterTargetStickiness(survivor, performance.now());
      const objectivePressure = getTargetObjectivePressure(survivor);
      const score = healthPriority * 460 + distance * chaseDifficulty + objectivePressure + stickiness;
      if (score < bestScore) {
        best = survivor;
        bestScore = score;
      }
    });
    return best;
  }

  function getCommittedRescueChaseTarget(now) {
    const target = hunter.target;
    if (!target || target !== aiTeamPlan.rescuer || !isValidHunterChaseTarget(target, now)) return null;
    if (distanceBetween(hunter, target) > HUNTER_TARGET_LOCK_MAX_DISTANCE) return null;
    return getSurvivors().some((survivor) => survivor.state === "seated" && survivor.chair) ? target : null;
  }

  function getValidHunterTargetLock(now) {
    const target = hunter.targetLock || hunter.target;
    if (!isValidHunterChaseTarget(target, now)) {
      clearHunterTargetLock();
      return null;
    }
    if (now >= (hunter.targetLockUntil || 0)) return null;
    if (distanceBetween(hunter, target) > HUNTER_TARGET_LOCK_MAX_DISTANCE) {
      clearHunterTargetLock();
      return null;
    }
    return target;
  }

  function isValidHunterChaseTarget(target, now = performance.now()) {
    return Boolean(target &&
      !isActorDecoyTarget(target) &&
      !target.escaped &&
      target.state !== "downed" &&
      target.state !== "seated" &&
      target.state !== "carried" &&
      target.state !== "eliminated" &&
      !isSurvivorInvisible(target, now) &&
      canAIHunterSeeThroughPerfume(target, now));
  }

  function clearHunterTargetLock() {
    hunter.targetLock = null;
    hunter.targetLockUntil = 0;
  }

  function lockHunterTarget(target, now, duration = HUNTER_TARGET_LOCK_AFTER_HIT) {
    if (!isValidHunterChaseTarget(target, now)) return;
    hunter.target = target;
    hunter.targetLock = target;
    hunter.targetLockUntil = Math.max(hunter.targetLockUntil || 0, now + duration);
    hunter.lastTargetHitAt = now;
  }

  function getHunterTargetStickiness(survivor, now) {
    if (survivor !== hunter.target && survivor !== hunter.targetLock) return 0;
    const hitAge = now - (hunter.lastTargetHitAt || 0);
    const hitBonus = hitAge >= 0 && hitAge < HUNTER_TARGET_LOCK_AFTER_HIT
      ? HUNTER_TARGET_STICKY_HIT_BONUS * (1 - hitAge / HUNTER_TARGET_LOCK_AFTER_HIT)
      : 0;
    return -(HUNTER_TARGET_STICKY_BASE + hitBonus);
  }

  function isActorDecoyTarget(target) {
    return Boolean(target && (target.kind === "actorDecoy" || target.kind === "actorRescuePhantom"));
  }

  function chooseActorDecoyTarget() {
    let best = null;
    let bestScore = Infinity;
    actorDecoys.forEach((decoy) => {
      const distance = distanceBetween(hunter, decoy);
      if (distance < bestScore) {
        best = decoy;
        bestScore = distance;
      }
    });
    return best;
  }

  function findActorDecoyAttackTarget(rangeMultiplier = 1) {
    let best = null;
    let bestDistance = Infinity;
    actorDecoys.forEach((decoy) => {
      if (!isSurvivorInHunterAttackCone(decoy, rangeMultiplier)) return;
      const distance = distanceBetween(hunter, decoy);
      if (distance < bestDistance) {
        best = decoy;
        bestDistance = distance;
      }
    });
    return best;
  }

  function breakActorDecoy(decoy, now) {
    if (decoy.action && decoy.action.kind === "rescuing" && decoy.action.target && decoy.action.target.chair) {
      decoy.action.target.chairProgressPausedUntil = 0;
    }
    const index = actorDecoys.indexOf(decoy);
    if (index >= 0) actorDecoys.splice(index, 1);
    if (hunter.target === decoy) hunter.target = null;
    if (selectedRole !== PLAYER_ROLE.hunter) {
      lanternAlert = { text: "幻象消散", until: now + 1200 };
    }
    chasePulseUntil = now + 360;
  }

  function getTargetChaseDifficulty(survivor) {
    const base = getSurvivorMultiplier(survivor, "chaseDifficulty", 1);
    const injuredModifier = survivor.state === "injured" ? 0.82 : 1;
    const actionModifier = survivor.action && ["repairing", "openingGate", "healing", "rescuing"].includes(survivor.action.kind) ? 0.86 : 1;
    return base * injuredModifier * actionModifier;
  }

  function getTargetObjectivePressure(survivor) {
    if (!survivor.action) return 0;
    if (survivor.action.kind === "rescuing") return -220;
    if (survivor.action.kind === "openingGate") return -130;
    if (survivor.action.kind === "repairing") return -80;
    if (survivor.action.kind === "healing") return -60;
    return 0;
  }

  function getTargetHealthPriority(survivor) {
    if (survivor.action && survivor.action.kind === "rescuing") return -2;
    if (isPressuringOccupiedChair(survivor)) return survivor.state === "injured" ? -1 : 0.25;
    if (survivor.state === "injured") return 0;
    if (survivor.state === "healthy") return 1;
    return 2;
  }

  function isPressuringOccupiedChair(survivor) {
    if (survivor.escaped || survivor.state !== "healthy" && survivor.state !== "injured") return false;
    return chairs.some((item) => {
      return item.survivor &&
        item.survivor.state === "seated" &&
        distanceBetween(survivor, item) < CHAIR_PRESSURE_RANGE;
    });
  }

  function moveHunterToward(dt, now, target) {
    const nearDroppedPallet = findNearestPallet(hunter, "dropped", 88);
    if (nearDroppedPallet) {
      startBreakPallet(nearDroppedPallet, now);
      return;
    }

    const routeWindow = findUsefulWindowForRoute(hunter, target, 132);
    if (routeWindow && !hunter.action) {
      startVault(hunter, routeWindow, getHunterVaultDuration(HUNTER_WINDOW_VAULT_DURATION), now, "vaulting");
      return;
    }

    const moved = moveActorToPoint(hunter, target.x, target.y, getHunterMoveSpeed(), dt, now);
    if (moved > 0.4) return;

    const nearWindow = findNearestWindow(hunter, 108);
    if (nearWindow && !hasWalkableLine(hunter.x, hunter.y, target.x, target.y, hunter.radius)) {
      startVault(hunter, nearWindow, getHunterVaultDuration(HUNTER_WINDOW_VAULT_DURATION), now, "vaulting");
      return;
    }

    hunter.path = [];
    if (dt > 0) hunter.status = "chasing";
  }

  function updateAIHunterBlindInPerfume(dt, now) {
    hunter.status = "blinded";
    const attackTarget = findHunterAttackTarget();
    if (attackTarget && canHunterAttack(now) && Math.random() < PERFUME_AI_BLIND_ATTACK_CHANCE) {
      startHunterBasicAttackWindup(now);
      return;
    }

    if (now >= (hunter.nextBlindWanderTurnAt || 0)) {
      let baseAngle = Number.isFinite(hunter.blindWanderAngle) ? hunter.blindWanderAngle : hunter.angle;
      if (Number.isFinite(hunter.lastKnownTargetX) && Number.isFinite(hunter.lastKnownTargetY)) {
        baseAngle = Math.atan2(hunter.lastKnownTargetY - hunter.y, hunter.lastKnownTargetX - hunter.x);
      }
      hunter.blindWanderAngle = baseAngle + (Math.random() - 0.5) * Math.PI * 0.9;
      hunter.nextBlindWanderTurnAt = now + PERFUME_AI_WANDER_TURN_INTERVAL + Math.random() * 650;
    }

    hunter.angle = turnToward(hunter.angle, hunter.blindWanderAngle || hunter.angle, hunter.turnSpeed * dt * 0.72);
    const moved = moveActorSmart(
      hunter,
      Math.cos(hunter.angle) * getHunterMoveSpeed() * dt * 0.82,
      Math.sin(hunter.angle) * getHunterMoveSpeed() * dt * 0.82
    );
    if (moved < 0.5 && now > (hunter.nextBlindWanderTurnAt || 0) - 220) {
      hunter.blindWanderAngle = hunter.angle + Math.PI * (0.55 + Math.random() * 0.9);
      hunter.nextBlindWanderTurnAt = now + 420;
    }
  }

  function updateAIHunterChairing(dt, now) {
    if (hunter.carrying) {
      if (canHunterAttack(now)) {
        const attackTarget = findHunterAttackTarget();
        if (attackTarget) {
          startHunterBasicAttackWindup(now);
          updateCarriedSurvivorPosition();
          return true;
        }
      }

      const chairTarget = findNearestEmptyChair(hunter, Infinity);
      if (!chairTarget) return false;
      if (distanceBetween(hunter, chairTarget) < 88) {
        startChairSurvivor(hunter.carrying, chairTarget, now);
        return true;
      }

      const nearDroppedPallet = findNearestPallet(hunter, "dropped", 88);
      if (nearDroppedPallet) {
        startBreakPallet(nearDroppedPallet, now);
        updateCarriedSurvivorPosition();
        return true;
      }

      const routeWindow = findUsefulWindowForRoute(hunter, chairTarget, 132);
      if (routeWindow && !hunter.action) {
        startVault(hunter, routeWindow, getHunterVaultDuration(HUNTER_WINDOW_VAULT_DURATION), now, "vaulting");
        updateCarriedSurvivorPosition();
        return true;
      }

      hunter.status = "carrying";
      moveActorToPoint(hunter, chairTarget.x, chairTarget.y, getHunterMoveSpeed() * getHunterCarrySpeedMultiplier(), dt, now);
      updateCarriedSurvivorPosition();
      return true;
    }

    const downed = findNearestDownedSurvivor(hunter, 118);
    if (downed) {
      startPickupSurvivor(downed, now);
      return true;
    }

    const target = findNearestDownedSurvivor(hunter, 520);
    if (!target) return false;
    hunter.status = "toChair";
    moveActorToPoint(hunter, target.x, target.y, getHunterMoveSpeed() * 0.86, dt, now);
    return true;
  }

  function applyHunterHit(survivor, now, options = {}) {
    if (survivor.escaped || survivor.state === "seated" || survivor.state === "carried" || survivor.state === "eliminated") return;
    if (isSurvivorInvulnerable(survivor, now)) {
      if (isFlywheelActive(survivor, now)) showAssistAlert("飞轮规避", now, 650);
      return;
    }
    if (isFighterArenaActive() && survivor === fighterArena.fighter) {
      fighterArena.fighterHealth = Math.max(0, fighterArena.fighterHealth - 1);
      survivor.action = null;
      survivor.vx = 0;
      survivor.vy = 0;
      if (fighterArena.fighterHealth <= 0) {
        finishFighterArena("fighterDefeated", now);
      } else {
        showAssistAlert(`擂台受击 · 格斗家${fighterArena.fighterHealth}/${FIGHTER_ARENA_HUNTER_HEALTH}血`, now, 900);
      }
      return true;
    }
    if (isShieldBearerGuarding(survivor, now)) {
      knockShieldBearerBackward(survivor);
      if (isShieldGuardFacingHunter(survivor)) {
        options = { ...options, shieldGuardDamageReduction: SHIELD_GUARD_DAMAGE_REDUCTION };
        showAssistAlert("大盾格挡 伤害-50", now, 760);
      } else {
        showAssistAlert("大盾手受击后退", now, 650);
      }
    }
    const terrorShock = isTerrorShockVulnerable(survivor);
    if (breakMedicShield(survivor, now)) return true;
    if (absorbGeneralRideHit(survivor, now)) return;
    if (shouldQueueMedicRescueShock(survivor, terrorShock)) {
      queueMedicRescueShockDamage(survivor, getQueuedHitDamage(survivor, options, terrorShock), now);
      claimAIChairRescueAfterBasicHit(survivor, now, options);
      lockHunterTarget(survivor, now);
      return;
    }
    if (isBorrowedTimeProtected(survivor, now)) {
      queueBorrowedTimeDamage(survivor, getQueuedHitDamage(survivor, options, terrorShock), now);
      claimAIChairRescueAfterBasicHit(survivor, now, options);
      lockHunterTarget(survivor, now);
      return;
    }
    if (isMedicAdrenalineProtected(survivor, now)) {
      queueMedicAdrenalineDamage(survivor, getQueuedHitDamage(survivor, options, terrorShock), now);
      claimAIChairRescueAfterBasicHit(survivor, now, options);
      lockHunterTarget(survivor, now);
      return;
    }
    if (options.applyBoneBleed) applyBoneBleed(survivor, now);
    if (options.basicAttack && isSoulBinder()) applySoulBinderBasicHit(survivor, now);
    if (survivor.action && (survivor.action.kind === "healing" || survivor.action.kind === "beingHealed")) {
      cancelHealing(survivor.action);
      survivor.action = null;
    }
    if (survivor.action && survivor.action.kind === "repairing") {
      cancelRepair(survivor.action);
      survivor.action = null;
    }
    if (survivor.action && survivor.action.kind === "openingGate") {
      cancelGateOpen(survivor.action);
      survivor.action = null;
    }
    if (survivor.action && survivor.action.kind === "escaping") {
      survivor.action = null;
    }
    if (survivor.action && survivor.action.kind === "navigationChannelSlide") {
      survivor.action = null;
    }
    if (survivor.action && survivor.action.kind === "fighterPunch") {
      survivor.action = null;
    }
    cancelNavigationChannelAim(survivor);
    const interruptedRescueTarget = survivor.action && survivor.action.kind === "rescuing" ? survivor.action.target : null;
    if (survivor.action && survivor.action.kind === "rescuing") {
      survivor.action = null;
    }
    if (survivor.action && survivor.action.kind === "vaulting") {
      survivor.action = null;
    }

    const wasDowned = survivor.state === "downed";
    if (options.detentionDown || terrorShock && options.allowTerrorShock !== false) {
      applySurvivorDamage(survivor, now, getQueuedHitDamage(survivor, options, terrorShock));
      createMirrorRiftAt(survivor, now);
      trackHunterFirstHitDownUnlock(survivor, now, wasDowned);
      trackHunterDownUnlock(survivor, now, wasDowned);
      trackHunterRemoteDownUnlock(survivor, now, wasDowned, options);
      trackDancerBlinkDownUnlock(survivor, now, wasDowned, options);
      if (!wasDowned && survivor.state === "downed") {
        triggerWantedBadge(survivor, now);
        triggerAbyssFormDownReset(now);
      }
      claimAIChairRescueAfterBasicHit(survivor, now, options);
      lockHunterTarget(survivor, now);
      return;
    }

    applySurvivorDamage(survivor, now, applyShieldGuardDamageReduction(getHunterHitBaseDamage(options), options));
    claimAIChairRescueAfterBasicHit(survivor, now, options, interruptedRescueTarget);
    createMirrorRiftAt(survivor, now);
    trackHunterFirstHitDownUnlock(survivor, now, wasDowned);
    trackHunterDownUnlock(survivor, now, wasDowned);
    trackHunterRemoteDownUnlock(survivor, now, wasDowned, options);
    trackDancerBlinkDownUnlock(survivor, now, wasDowned, options);
    if (!wasDowned && survivor.state === "downed") {
      triggerWantedBadge(survivor, now);
      triggerAbyssFormDownReset(now);
    }
    triggerActorHitPerformance(survivor, now);
    lockHunterTarget(survivor, now);
  }

  function hasMedicShield(survivor, now = performance.now()) {
    return survivor && (survivor.medicShieldHits || 0) > 0 && now < (survivor.medicShieldUntil || 0);
  }

  function absorbGeneralRideHit(survivor, now) {
    if (!isGeneralRiding(survivor, now)) return false;
    finishGeneralRide(survivor, now, "hit");
    survivor.healProgress = 0;
    chasePulseUntil = now + 320;
    return true;
  }

  function breakMedicShield(survivor, now) {
    if (!hasMedicShield(survivor, now)) return false;
    const source = survivor.medicShieldSource || "medic";
    survivor.medicShieldHits = 0;
    survivor.medicShieldUntil = 0;
    survivor.medicShieldSource = null;
    if (source === "messenger") {
      hunter.wipeUntil = Math.max(hunter.wipeUntil || 0, now + MESSENGER_SHIELD_WIPE_DURATION);
      hunter.status = "wipe";
      hunter.vx = 0;
      hunter.vy = 0;
      showAssistAlert("信使护盾破碎", now, 900);
      chasePulseUntil = now + 360;
      return true;
    }
    knockHunterBackFrom(survivor, MEDIC_SHIELD_KNOCKBACK, now);
    stunHunterFromMedicShield(now);
    showAssistAlert("护盾破碎", now, 900);
    chasePulseUntil = now + 360;
    return true;
  }

  function stunHunterFromMedicShield(now) {
    if (consumeExcitementGuard(now)) return;
    if (hunter.action && hunter.action.kind === "attackWindup") {
      hunter.action = null;
      hunter.lastAttackHit = false;
    }
    if (hunter.action && (hunter.action.kind === "hammerCharge" || hunter.action.kind === "hammerLeap")) {
      hunter.action = null;
    }
    cancelSawDashByControl(now);
    cancelDanceStepByControl(now);
    if (hunter.action && hunter.action.kind === "pickingUp") {
      cancelPickupAction(hunter.action, now, true);
      hunter.action = null;
    }
    dropCarriedSurvivorFromControl(now);
    hunter.stunnedUntil = Math.max(hunter.stunnedUntil || 0, now + MEDIC_SHIELD_STUN);
    hunter.wipeUntil = 0;
    hunter.status = "stunned";
    hunter.path = [];
    hunter.pathGoal = null;
    hunter.vx = 0;
    hunter.vy = 0;
  }

  function knockHunterBackFrom(source, distance, now = performance.now()) {
    cancelSawDashByControl(now);
    cancelDanceStepByControl(now);
    const angle = Math.atan2(hunter.y - source.y, hunter.x - source.x);
    const fallbackAngle = Number.isFinite(angle) ? angle : hunter.angle + Math.PI;
    const safe = findNearestSafePosition(
      hunter.x + Math.cos(fallbackAngle) * distance,
      hunter.y + Math.sin(fallbackAngle) * distance,
      hunter.radius
    );
    hunter.x = safe.x;
    hunter.y = safe.y;
    hunter.vx = 0;
    hunter.vy = 0;
    hunter.path = [];
    hunter.pathGoal = null;
  }

  function cancelSawDashByControl(now, message = "拉锯被打断") {
    if (!hunter.action || hunter.action.kind !== "sawDash") return false;
    hunter.action = null;
    hunter.shortSawAvailableUntil = 0;
    hunter.pendingSawWipe = false;
    hunter.pendingSawWipeAt = 0;
    hunter.vx = 0;
    hunter.vy = 0;
    hunter.status = hunter.target ? "chasing" : "ready";
    showAssistAlert(message, now, 900);
    chasePulseUntil = now + 360;
    return true;
  }

  function cancelDanceStepByControl(now) {
    if (!hunter.action || hunter.action.kind !== "danceStep") return false;
    hunter.action = null;
    hunter.vx = 0;
    hunter.vy = 0;
    hunter.status = hunter.target ? "chasing" : "ready";
    showAssistAlert("舞步被打断", now, 900);
    chasePulseUntil = now + 360;
    return true;
  }

  function isMedicAdrenalineProtected(survivor, now = performance.now()) {
    return survivor && now < (survivor.medicAdrenalineUntil || 0) && survivor.state !== "downed";
  }

  function shouldQueueMedicRescueShock(survivor, terrorShock) {
    return Boolean(isMedic(survivor) && terrorShock && survivor.action && survivor.action.kind === "rescuing");
  }

  function queueMedicRescueShockDamage(survivor, amount, now) {
    survivor.medicRescueShockPendingDamage = Math.min(2, (survivor.medicRescueShockPendingDamage || 0) + amount);
    survivor.healProgress = 0;
    showAssistAlert("前线救护", now, 900);
    chasePulseUntil = now + 320;
  }

  function queueMedicAdrenalineDamage(survivor, amount, now) {
    survivor.medicAdrenalinePendingDamage = Math.min(2, (survivor.medicAdrenalinePendingDamage || 0) + amount);
    survivor.healProgress = 0;
    showAssistAlert("肾上腺素延伤", now, 900);
    chasePulseUntil = now + 320;
  }

  function isFlywheelActive(survivor, now = performance.now()) {
    return Boolean(survivor && hasSurvivorBadge(survivor, "flywheel") && survivor.action && survivor.action.kind === "flywheelDash" && now < survivor.action.until);
  }

  function isSurvivorInvulnerable(survivor, now) {
    if (!survivor || !survivor.action || now >= survivor.action.until) return false;
    return isFencer(survivor) && survivor.action.kind === "fencerLunge" ||
      isFlywheelActive(survivor, now);
  }

  function triggerWantedBadge(downedSurvivor, now) {
    if (!hasHunterBadge("wanted")) return;
    const candidates = getSurvivors().filter((survivor) => {
      return survivor !== downedSurvivor &&
        !survivor.escaped &&
        (survivor.state === "healthy" || survivor.state === "injured");
    });
    const target = candidates[Math.floor(Math.random() * candidates.length)];
    if (!target) return;
    hunter.wantedTarget = target;
    hunter.wantedUntil = now + WANTED_REVEAL_DURATION;
    if (selectedRole === PLAYER_ROLE.hunter) showAssistAlert(`通缉 ${getSurvivorDisplayName(target)}`, now, 1100);
  }

  function isBorrowedTimeProtected(survivor, now = performance.now()) {
    return survivor && now < (survivor.borrowedTimeUntil || 0) && survivor.state !== "downed";
  }

  function getQueuedHitDamage(survivor, options, terrorShock) {
    if (options.detentionDown || terrorShock && options.allowTerrorShock !== false) {
      const amount = survivor.state === "healthy" ? 2 : 1;
      return getEffectiveSurvivorDamage(survivor, applyShieldGuardDamageReduction(amount, options), performance.now());
    }
    let amount = getHunterHitBaseDamage(options);
    amount = applyShieldGuardDamageReduction(amount, options);
    return getEffectiveSurvivorDamage(survivor, amount, performance.now());
  }

  function getHunterHitBaseDamage(options = {}) {
    const amount = options.damage ?? 1;
    const now = performance.now();
    if (
      options.basicAttack ||
      !Number.isFinite(options.damage) ||
      amount <= 0 ||
      amount >= 1 ||
      !hasHunterBadge("criticalPoint") ||
      !areExitsPowered() ||
      now < (hunter.nextCriticalPointAt || 0)
    ) return amount;
    hunter.nextCriticalPointAt = now + CRITICAL_POINT_COOLDOWN;
    if (selectedRole === PLAYER_ROLE.hunter) showAssistAlert("临界点", now, 700);
    return 1;
  }

  function getEffectiveSurvivorDamage(survivor, amount, now = performance.now()) {
    if (isGeneral(survivor) && amount > 1) {
      showAssistAlert("身经百战", now, 760);
      return 1;
    }
    return amount;
  }

  function getDamageProgressPercent(survivor) {
    const progress = survivor && survivor.damageProgress || 0;
    if (progress <= DAMAGE_PROGRESS_EPSILON) return 0;
    return Math.max(1, Math.min(99, Math.floor(progress * 100 + DAMAGE_PROGRESS_EPSILON)));
  }

  function getDamageProgressLabel(survivor) {
    const percent = getDamageProgressPercent(survivor);
    return percent > 0 ? `裂伤${percent}%` : "";
  }

  function getSurvivorDamageLevel(survivor) {
    const partialDamage = Math.max(0, Math.min(0.999, survivor.damageProgress || 0));
    if (survivor.state === "downed") return 2;
    if (survivor.state === "injured") return 1 + partialDamage;
    return partialDamage;
  }

  function applyPhysicianBenevolence(healer, target, now = performance.now()) {
    if (!hasSurvivorBadge(healer, "physicianBenevolence") || now < (healer.nextPhysicianBenevolenceAt || 0)) return false;
    const damageLevel = getSurvivorDamageLevel(target);
    if (damageLevel <= DAMAGE_PROGRESS_EPSILON) return false;
    const remainingDamage = Math.max(0, damageLevel - PHYSICIAN_BENEVOLENCE_HEAL);
    if (remainingDamage >= 1 - DAMAGE_PROGRESS_EPSILON) return false;
    if (remainingDamage <= DAMAGE_PROGRESS_EPSILON) {
      target.state = "healthy";
      target.damageProgress = 0;
      target.injuredAt = null;
      target.boostUntil = 0;
    } else {
      target.state = "healthy";
      target.damageProgress = remainingDamage;
      target.injuredAt = null;
    }
    healer.nextPhysicianBenevolenceAt = now + PHYSICIAN_BENEVOLENCE_COOLDOWN;
    showAssistAlert("医者仁心", now, 760);
    return true;
  }

  function queueBorrowedTimeDamage(survivor, amount, now) {
    survivor.borrowedTimePendingDamage = Math.min(2, (survivor.borrowedTimePendingDamage || 0) + amount);
    survivor.healProgress = 0;
    chasePulseUntil = now + 320;
    showAssistAlert("搏命延伤", now, 760);
  }

  function updateBorrowedTime(now) {
    getSurvivors().forEach((survivor) => {
      if (!survivor.borrowedTimeUntil || now < survivor.borrowedTimeUntil) return;
      survivor.borrowedTimeUntil = 0;
      settleBorrowedTimeDamage(survivor, now);
    });
  }

  function settleBorrowedTimeDamage(survivor, now) {
    const amount = getEffectiveSurvivorDamage(survivor, survivor.borrowedTimePendingDamage || 0, now);
    survivor.borrowedTimePendingDamage = 0;
    if (amount <= 0 || survivor.escaped || survivor.state === "eliminated" || survivor.state === "seated" || survivor.state === "carried") return;
    const wasDowned = survivor.state === "downed";
    applySurvivorDamage(survivor, now, amount);
    if (!wasDowned && survivor.state === "downed") {
      chasePulseUntil = now + 420;
      triggerWantedBadge(survivor, now);
    }
  }

  function updateMedicEffects(now) {
    getSurvivors().forEach((survivor) => {
      if (survivor.medicShieldUntil && now >= survivor.medicShieldUntil) {
        survivor.medicShieldUntil = 0;
        survivor.medicShieldHits = 0;
        survivor.medicShieldSource = null;
      }
      if ((survivor.medicRescueShockPendingDamage || 0) > 0 && (!survivor.action || survivor.action.kind !== "rescuing")) {
        settleMedicRescueShockDamage(survivor, now);
      }
      if (survivor.medicAdrenalineUntil && now >= survivor.medicAdrenalineUntil) {
        survivor.medicAdrenalineUntil = 0;
        settleMedicAdrenalineDamage(survivor, now);
      }
      if (
        isMedic(survivor) &&
        !survivor.medicFirstChaseUsed &&
        hunter.target === survivor &&
        (survivor.state === "healthy" || survivor.state === "injured") &&
        distanceBetween(hunter, survivor) <= HEARTBEAT_RANGE
      ) {
        survivor.medicFirstChaseUsed = true;
        survivor.medicFirstChaseUntil = now + MEDIC_FIRST_CHASE_DURATION;
        showAssistAlert("军医 应急撤离", now, 900);
      }
    });
  }

  function updateGeneralEffects(now, dt = 0) {
    getSurvivors().forEach((survivor) => {
      updateGeneralRage(survivor, now, dt);
      if (isGeneral(survivor) && survivor.generalRideUntil && now >= survivor.generalRideUntil) {
        finishGeneralRide(survivor, now, "timeout");
      }
    });
  }

  function updateTunerEffects(dt = 0) {
    getSurvivors().forEach((survivor) => {
      if (!isTuner(survivor) || survivor.escaped || survivor.state !== "healthy" && survivor.state !== "injured") return;
      const chased = hunter.target === survivor && distanceBetween(survivor, hunter) <= HEARTBEAT_RANGE;
      if (chased) addTunerResonance(survivor, TUNER_CHASE_RESONANCE_PER_SECOND * dt);
    });
  }

  function settleMedicRescueShockDamage(survivor, now) {
    const amount = survivor.medicRescueShockPendingDamage || 0;
    survivor.medicRescueShockPendingDamage = 0;
    applyDelayedMedicDamage(survivor, amount, now);
  }

  function settleMedicAdrenalineDamage(survivor, now) {
    const amount = survivor.medicAdrenalinePendingDamage || 0;
    survivor.medicAdrenalinePendingDamage = 0;
    applyDelayedMedicDamage(survivor, amount, now);
  }

  function applyDelayedMedicDamage(survivor, amount, now) {
    amount = getEffectiveSurvivorDamage(survivor, amount, now);
    if (amount <= 0 || survivor.escaped || survivor.state === "eliminated" || survivor.state === "seated" || survivor.state === "carried") return;
    if (isBorrowedTimeProtected(survivor, now)) {
      queueBorrowedTimeDamage(survivor, amount, now);
      return;
    }
    if (isMedicAdrenalineProtected(survivor, now)) {
      queueMedicAdrenalineDamage(survivor, amount, now);
      return;
    }
    const wasDowned = survivor.state === "downed";
    if (amount >= 2 || survivor.state === "injured") {
      downSurvivor(survivor);
      chasePulseUntil = now + 420;
      if (!wasDowned) triggerWantedBadge(survivor, now);
      return;
    }
    applySurvivorDamage(survivor, now, amount);
    if (!wasDowned && survivor.state === "downed") triggerWantedBadge(survivor, now);
  }

  function applySoulBinderBasicHit(survivor, now) {
    addSoulMark(survivor, 1);
    if (hunter.soulSiphonTarget !== survivor || now > (hunter.soulSiphonUntil || 0)) return;
    getSurvivors().forEach((target) => {
      if (target !== survivor && getSoulMarks(target) > 0) addSoulMark(target, 1);
    });
    hunter.soulSiphonTarget = null;
    hunter.soulSiphonUntil = 0;
    hunter.soulSelectionMode = null;
    showAssistAlert("摄魂命中", now, 1200);
  }

  function canStartSoulSiphon(now) {
    return matchStarted &&
      isSoulBinder() &&
      hunter.presenceTier >= 1 &&
      !hunter.action &&
      !hunter.carrying &&
      now >= hunter.stunnedUntil &&
      now >= hunter.wipeUntil &&
      now >= (hunter.nextSoulSiphonAt || 0) &&
      getSurvivors().some((survivor) => getSoulMarks(survivor) > 0 && !survivor.escaped && survivor.state !== "eliminated");
  }

  function startSoulSiphonSelection(now) {
    if (!canStartSoulSiphon(now)) {
      showAssistAlert(getSoulSiphonBlockedReason(now), now, 1200);
      return false;
    }
    hunter.soulSelectionMode = "siphon";
    hunter.soulSelectionCandidate = null;
    hunter.soulSelectionCount = 0;
    hunter.soulSelectionAt = now;
    showAssistAlert("双击魂印目标", now, 1200);
    return true;
  }

  function getSoulSiphonBlockedReason(now) {
    if (!matchStarted || selectedRole !== PLAYER_ROLE.hunter || !isSoulBinder()) return "摄魂不可用";
    if (hunter.presenceTier < 1) return "需要一阶";
    if (hunter.action || hunter.carrying || now < hunter.stunnedUntil || now < hunter.wipeUntil) return "正在行动";
    if (now < (hunter.nextSoulSiphonAt || 0)) return `摄魂冷却${formatCooldown(hunter.nextSoulSiphonAt - now)}`;
    return "没有魂印目标";
  }

  function startSoulSiphon(target, now) {
    if (!canStartSoulSiphon(now) || !target || getSoulMarks(target) <= 0 || target.escaped || target.state === "eliminated") return false;
    hunter.soulSiphonTarget = target;
    hunter.soulSiphonUntil = now + SOUL_SIPHON_DURATION;
    hunter.nextSoulSiphonAt = now + SOUL_SIPHON_COOLDOWN;
    hunter.soulSelectionMode = null;
    showAssistAlert(`摄魂 ${target.name}`, now, 1200);
    return true;
  }

  function canBorrowSoul(now) {
    return matchStarted &&
      isSoulBinder() &&
      hunter.presenceTier >= 2 &&
      !hunter.action &&
      !hunter.carrying &&
      now >= hunter.stunnedUntil &&
      now >= hunter.wipeUntil &&
      (isSoulBinderPracticeMode() || now >= (hunter.nextBorrowSoulAt || 0)) &&
      getTotalSoulMarks() > 0;
  }

  function borrowSoul(now) {
    if (!canBorrowSoul(now)) return false;
    const total = getTotalSoulMarks();
    if (!isSoulBinderPracticeMode()) {
      getSurvivors().forEach((survivor) => {
        survivor.soulMarks = 0;
      });
    }
    hunter.borrowSoulSpeedBonus = total * BORROW_SOUL_SPEED_PER_MARK;
    hunter.borrowSoulRecoveryBonus = total * BORROW_SOUL_RECOVERY_PER_MARK;
    hunter.borrowSoulUntil = now + BORROW_SOUL_DURATION;
    hunter.nextBorrowSoulAt = isSoulBinderPracticeMode() ? now : now + BORROW_SOUL_COOLDOWN;
    showAssistAlert(`借魂 ${total}层`, now, 1200);
    return true;
  }

  function isSoulPatrolPoint(point) {
    return Boolean(point && !point.completed && point.soulPatrolAt);
  }

  function getSoulPatrolPoints() {
    return repairPoints.filter(isSoulPatrolPoint);
  }

  function getSoulPatrolTarget(preferredPoint = null, allowRemote = false) {
    if (preferredPoint && !preferredPoint.completed) return preferredPoint;
    const candidates = repairPoints.filter((point) => !point.completed);
    if (candidates.length === 0) return null;
    const aim = getAimTargetFromPointer(null, null, true);
    if (aim) {
      const aimed = candidates
        .map((point) => ({ point, distance: distanceBetween(point, aim) }))
        .sort((a, b) => a.distance - b.distance)[0];
      if (aimed && (allowRemote || aimed.distance <= SOUL_PATROL_TARGET_RANGE)) return aimed.point;
    }
    return candidates.sort((a, b) => distanceBetween(hunter, a) - distanceBetween(hunter, b))[0];
  }

  function canStartSoulPatrol(now) {
    return matchStarted &&
      isSoulBinder() &&
      !hunter.action &&
      !hunter.carrying &&
      now >= hunter.stunnedUntil &&
      now >= hunter.wipeUntil &&
      now >= (hunter.nextSoulPatrolAt || 0) &&
      repairPoints.some((point) => !point.completed);
  }

  function canActivateSoulPatrolFloat(now) {
    return matchStarted &&
      isSoulBinder() &&
      hunter.soulPatrolFloatReady &&
      !hunter.action &&
      !hunter.carrying &&
      now >= hunter.stunnedUntil &&
      now >= hunter.wipeUntil;
  }

  function getSoulPatrolBlockedReason(now) {
    if (!matchStarted || selectedRole !== PLAYER_ROLE.hunter || !isSoulBinder()) return "魂巡不可用";
    if (hunter.action || hunter.carrying || now < hunter.stunnedUntil || now < hunter.wipeUntil) return "正在行动";
    if (now < (hunter.nextSoulPatrolAt || 0)) return `魂巡冷却${formatCooldown(hunter.nextSoulPatrolAt - now)}`;
    return "没有密码机";
  }

  function startSoulPatrol(now, preferredPoint = null) {
    if (!canStartSoulPatrol(now)) {
      showAssistAlert(getSoulPatrolBlockedReason(now), now, 1200);
      return false;
    }
    const empowered = Boolean(hunter.soulPatrolEmpowered);
    const point = getSoulPatrolTarget(preferredPoint, empowered);
    if (!point) return false;
    if (!isSoulPatrolPoint(point) && getSoulPatrolPoints().length >= SOUL_PATROL_MAX_CIPHERS) {
      const oldest = getSoulPatrolPoints().sort((a, b) => a.soulPatrolAt - b.soulPatrolAt)[0];
      if (oldest) oldest.soulPatrolAt = 0;
    }
    point.soulPatrolAt = now;
    if (empowered) {
      point.soulPatrolDecayUntil = now + SOUL_PATROL_EMPOWERED_DECAY_DURATION;
      point.nextSoulPatrolDecayAt = now + SOUL_PATROL_EMPOWERED_DECAY_INTERVAL;
      hunter.soulPatrolEmpowered = false;
    }
    hunter.soulPatrolPoint = point;
    hunter.soulPatrolFloatReady = true;
    hunter.nextSoulPatrolAt = now + SOUL_PATROL_COOLDOWN;
    hunter.path = [];
    hunter.pathGoal = null;
    showAssistAlert(empowered ? `远程魂巡 · 退机10秒` : `魂巡附印 · 再按F漂浮`, now, 1200);
    return true;
  }

  function activateSoulPatrolFloat(now) {
    if (!canActivateSoulPatrolFloat(now)) return false;
    hunter.soulPatrolFloatReady = false;
    hunter.soulPatrolUntil = now + SOUL_PATROL_DURATION;
    hunter.soulPatrolInstantVaultsLeft = SOUL_PATROL_INSTANT_VAULTS_PER_CAST;
    hunter.path = [];
    hunter.pathGoal = null;
    showAssistAlert("魂巡漂浮", now, 900);
    return true;
  }

  function useSoulPatrol(now, preferredPoint = null) {
    if (canActivateSoulPatrolFloat(now)) return activateSoulPatrolFloat(now);
    return startSoulPatrol(now, preferredPoint);
  }

  function getTotalSoulMarks() {
    return getSurvivors().reduce((total, survivor) => total + getSoulMarks(survivor), 0);
  }

  function triggerActorHitPerformance(survivor, now) {
    if (!isActor(survivor)) return;
    if (survivor.state !== "healthy" && survivor.state !== "injured") return;
    createActorDecoy(survivor, now);
    survivor.invisibleUntil = Math.max(survivor.invisibleUntil || 0, now + ACTOR_HIT_STEALTH_DURATION);
    survivor.boostUntil = Math.max(survivor.boostUntil || 0, now + ACTOR_HIT_STEALTH_DURATION);
    if (hunter.target === survivor) hunter.target = null;
  }

  function createActorDecoy(actor, now) {
    const angle = Number.isFinite(actor.angle) ? actor.angle : 0;
    actorDecoys.push(createSmartDecoy(actor, actor.x, actor.y, angle, {
      state: actor.state === "healthy" ? "healthy" : "injured",
      damageProgress: actor.damageProgress || 0,
      speed: ACTOR_DECOY_SPEED,
      until: now + ACTOR_DECOY_DURATION
    }));
  }

  function createSmartDecoy(owner, x, y, angle, options = {}) {
    return {
      id: ++actorDecoyId,
      kind: options.kind || "actorDecoy",
      name: options.name || owner.name,
      owner,
      x,
      y,
      state: options.state || "healthy",
      damageProgress: options.damageProgress || 0,
      radius: owner.radius,
      angle,
      speed: options.speed || owner.speed || player.speed,
      sprintSpeed: options.sprintSpeed || owner.sprintSpeed || player.sprintSpeed,
      vx: Math.cos(angle) * (options.speed || ACTOR_DECOY_SPEED),
      vy: Math.sin(angle) * (options.speed || ACTOR_DECOY_SPEED),
      fill: owner.fill,
      core: owner.core,
      boostUntil: 0,
      action: null,
      nextInteractAt: 0,
      wanderTarget: null,
      kiteDecision: null,
      path: [],
      pathGoal: null,
      repathAt: 0,
      rescuePhantom: Boolean(options.rescuePhantom),
      guardTarget: options.guardTarget || null,
      rescueCompleted: false,
      duration: options.duration || ACTOR_DECOY_DURATION,
      until: options.until || performance.now() + ACTOR_DECOY_DURATION
    };
  }

  function applySurvivorDamage(survivor, now, amount) {
    amount = getEffectiveSurvivorDamage(survivor, amount, now);
    if (!Number.isFinite(amount) || amount <= 0) return;

    let damageProgress = (survivor.damageProgress || 0) + amount;
    while (damageProgress + DAMAGE_PROGRESS_EPSILON >= 1) {
      damageProgress -= 1;
      if (damageProgress < DAMAGE_PROGRESS_EPSILON) damageProgress = 0;

      if (survivor.state === "healthy") {
        firstSurvivorInjuryOccurred = true;
        survivor.state = "injured";
        survivor.injuredAt = now;
        survivor.healProgress = 0;
        triggerTunerSorrowCalibrations(survivor, now);
        if (damageProgress + DAMAGE_PROGRESS_EPSILON < 1) {
          survivor.damageProgress = damageProgress;
          survivor.boostUntil = now + getSurvivorHitBoostDuration(survivor, 1800);
          return;
        }
        continue;
      }

      if (survivor.state === "injured") {
        survivor.damageProgress = 0;
        downSurvivor(survivor);
      }
      return;
    }

    survivor.damageProgress = Math.max(0, damageProgress);
    if (survivor.damageProgress > 0) {
      survivor.healProgress = 0;
      chasePulseUntil = now + 260;
    }
  }

  function triggerTunerSorrowCalibrations(injuredSurvivor, now) {
    getSurvivors().forEach((tuner) => {
      if (tuner === injuredSurvivor || !isTuner(tuner)) return;
      if (now < (tuner.nextTunerSorrowCalibrationAt || 0)) return;
      const action = tuner.action;
      if (!action || action.kind !== "repairing" || !action.point || action.point.completed) return;
      tuner.nextTunerSorrowCalibrationAt = now + TUNER_SORROW_CALIBRATION_COOLDOWN;
      action.forcedTunerCalibrations = (action.forcedTunerCalibrations || 0) + TUNER_SORROW_CALIBRATION_COUNT;
      if (!action.calibration) startRepairCalibration(action, now, true);
      showAssistAlert("悲痛校准 x3", now, 950);
    });
  }

  function isTerrorShockVulnerable(survivor) {
    return Boolean(survivor.action && ["vaulting", "rescuing", "repairing", "dismantlingLamp", "dismantlingPeeper", "dismantlingSoulPatrol"].includes(survivor.action.kind));
  }

  function downSurvivor(survivor) {
    const wasDowned = survivor.state === "downed";
    survivor.state = "downed";
    survivor.healProgress = 0;
    survivor.damageProgress = 0;
    survivor.injuredAt = null;
    survivor.stitchPack = null;
    survivor.medicShieldUntil = 0;
    survivor.medicShieldHits = 0;
    survivor.medicShieldSource = null;
    survivor.medicAdrenalineUntil = 0;
    survivor.medicAdrenalinePendingDamage = 0;
    survivor.medicRescueShockPendingDamage = 0;
    survivor.medicFirstChaseUsed = false;
    survivor.medicFirstChaseUntil = 0;
    survivor.generalRideUntil = 0;
    survivor.generalRideWhips = 0;
    survivor.nextGeneralWhipAt = 0;
    survivor.generalRage = 0;
    survivor.shieldGuardUntil = 0;
    survivor.chair = null;
    survivor.carryProgress = 0;
    survivor.downedAt = wasDowned && survivor.downedAt ? survivor.downedAt : performance.now();
    survivor.action = null;
    survivor.vx = 0;
    survivor.vy = 0;
    survivor.path = [];
    survivor.pathGoal = null;
    survivor.kiteDecision = null;
    survivor.objectiveDecision = null;
    survivor.healDecision = null;
    cancelFencerLungePreparation(survivor);
    if (!wasDowned && isSoulBinder()) {
      hunter.soulPatrolEmpowered = true;
      showAssistAlert("魂巡强化 · 下一次可远程退机", performance.now(), 1300);
    }
  }

  function resetMatch() {
    matchResult = null;
    fighterArena = null;
    quickChatRecipient = null;
    quickChatOpen = false;
    matchStartedAt = performance.now();
    firstSurvivorInjuryOccurred = false;
    tunerFirstCipherBeforeInjuryRecorded = false;
    applyRandomMapLayout();

    pallets.forEach((pallet) => {
      pallet.label = "standing";
    });
    invalidateCollisionRects();

    repairPoints.forEach((point) => {
      point.progress = 0;
      point.completed = false;
      point.workers = [];
      point.soulPatrolAt = 0;
      point.soulPatrolDecayUntil = 0;
      point.nextSoulPatrolDecayAt = 0;
      point.abnormalUses = 0;
      point.abnormalDecayUntil = 0;
      point.nextAbnormalDecayAt = 0;
    });

    exitGates.forEach((gate) => {
      gate.progress = 0;
      gate.opened = false;
      gate.workers = [];
    });
    hatch.spawned = false;
    hatch.opened = false;
    soulLamps.length = 0;
    assistPeeperWards.length = 0;
    packageProjectiles.length = 0;
    edictTraps.length = 0;
    edictHooks.length = 0;
    abyssTentacles.length = 0;
    abyssProjections.length = 0;
    huntingHounds.length = 0;
    hammerShockEffects.length = 0;
    navigationChannels.length = 0;
    ghostfireProjectiles.length = 0;
    antiqueEffects.length = 0;
    stitchPackDrops.length = 0;
    actorDecoys.length = 0;
    perfumeMists.length = 0;
    tunerEchoLines.length = 0;
    mirrorRifts.length = 0;
    mirrorCurtains.length = 0;
    danceLines.length = 0;
    pendingDancePoint = null;
    pendingDanceLine = null;
    dancePointAim = null;
    edictHookAim = null;
    abyssTentacleAim = null;
    navigationChannelAim = null;
    mirrorCurtainAim = null;
    twinShadowZones.length = 0;
    twinSwordProjectiles.length = 0;
    twinAim = null;
    activePatroller = null;
    activeShiftPortals = null;
    assistListenTargets = [];
    finalCipherGuard = null;
    aiTeamPlan = { until: 0, rescuer: null, gateOpener: null, repairLead: null };
    nextSoulLampAt = 0;
    lanternAlert = null;
    playerChaseTaskState = null;
    pendingSafeRescueTasks.length = 0;

    chairs.forEach((item) => {
      item.survivor = null;
      item.destroyed = false;
    });

    const survivors = getSurvivors();
    const survivorSpawns = pickSurvivorSpawns(survivors);
    survivors.forEach((survivor, index) => resetSurvivor(survivor, survivorSpawns[index]));

    const hunterSpawn = pickHunterSpawn(survivorSpawns);

    hunter.x = hunterSpawn.x;
    hunter.y = hunterSpawn.y;
    hunter.vx = 0;
    hunter.vy = 0;
    hunter.angle = Math.PI;
    hunter.target = null;
    hunter.targetLock = null;
    hunter.targetLockUntil = 0;
    hunter.lastTargetHitAt = 0;
    hunter.lastAttackAt = -10000;
    hunter.wipeUntil = 0;
    hunter.lastAttackHit = false;
    hunter.stunnedUntil = 0;
    hunter.fighterArenaStunUntil = 0;
    hunter.stopAttackUntil = 0;
    hunter.tunerEchoSlowUntil = 0;
    hunter.presenceHits = 0;
    hunter.presenceTier = 0;
    hunter.rampagePresenceGained = 0;
    hunter.nextRampageAt = hasHunterBadge("rampage") ? performance.now() + RAMPAGE_FIRST_PRESENCE_DELAY : 0;
    hunter.nextCriticalPointAt = 0;
    hunter.wantedTarget = null;
    hunter.wantedUntil = 0;
    hunter.trumpCardUsed = false;
    hunter.trumpCardSelecting = false;
    hunter.trumpCardSelectionUntil = 0;
    hunter.excitementGuardUntil = 0;
    hunter.mirrorTeleportReadyAt = 0;
    hunter.nextMirrorCurtainAt = 0;
    hunter.nextMirrorLightAt = 0;
    hunter.nextDanceStepAt = 0;
    hunter.nextDanceSpinAt = 0;
    hunter.nextInfiniteDanceAt = 0;
    hunter.infiniteDanceUntil = 0;
    hunter.nextEdictTrapAt = 0;
    hunter.nextEdictHookAt = 0;
    hunter.nextAbyssTentacleAt = 0;
    hunter.nextAbyssFormAt = 0;
    hunter.abyssFormUntil = 0;
    hunter.nextAbyssWhisperAt = 0;
    hunter.nextAbyssProjectionAt = 0;
    hunter.abyssValue = 0;
    hunter.abyssGazeProgress = 0;
    hunter.abyssSenseTargets = [];
    hunter.nextHoundAt = 0;
    hunter.nextHammerShockAt = 0;
    hunter.nextShadowTeleportAt = 0;
    hunter.nextGhostfireAt = 0;
    hunter.nextAssistAt = 0;
    hunter.pendingBlinkAttackUntil = 0;
    hunter.blinkDownEligibleUntil = 0;
    hunter.mirrorEndgameFourSafe = false;
    hunter.assistListenUntil = 0;
    hunter.nextSoulSiphonAt = 0;
    hunter.soulSiphonTarget = null;
    hunter.soulSiphonUntil = 0;
    hunter.soulSiphonPenaltyUntil = 0;
    hunter.nextBorrowSoulAt = 0;
    hunter.borrowSoulUntil = 0;
    hunter.borrowSoulSpeedBonus = 0;
    hunter.borrowSoulRecoveryBonus = 0;
    hunter.nextSoulPatrolAt = 0;
    hunter.soulPatrolUntil = 0;
    hunter.soulPatrolPoint = null;
    hunter.soulPatrolFloatReady = false;
    hunter.soulPatrolInstantVaultsLeft = 0;
    hunter.soulPatrolEmpowered = false;
    hunter.soulSelectionMode = null;
    hunter.soulSelectionCandidate = null;
    hunter.soulSelectionCount = 0;
    hunter.soulSelectionAt = 0;
    hunter.blindWanderAngle = hunter.angle;
    hunter.nextBlindWanderTurnAt = 0;
    hunter.lastKnownTargetX = null;
    hunter.lastKnownTargetY = null;
    hunter.nextSawDashAt = 0;
    hunter.sawAttackLockedUntil = 0;
    hunter.shortSawAvailableUntil = 0;
    hunter.pendingSawWipe = false;
    hunter.pendingSawWipeAt = 0;
    hunter.twinForm = TWIN_FORM_QINGTIAN;
    hunter.twinIntent = TWIN_INTENT_INITIAL;
    hunter.twinEnlightenedUntil = 0;
    hunter.twinEnlightenmentCount = 0;
    hunter.twinFlyingSwords = 0;
    hunter.nextTwinFormAt = 0;
    hunter.nextTwinShadowLockAt = 0;
    hunter.nextTwinShadowStrikeAt = 0;
    hunter.nextTwinDualCastAt = 0;
    hunter.twinDualCastUntil = 0;
    hunter.twinTimePower = null;
    hunter.twinTimeMode = "self";
    hunter.action = null;
    hunter.carrying = null;
    hunter.status = "chasing";
    hunter.target = null;
    hunter.unlockFirstHitRecords = new Map();
    hunter.path = [];
    hunter.pathGoal = null;
    hunter.repathAt = 0;
    applyModeAfterReset();
  }

  function applyModeAfterReset() {
    if (isInfiniteSawboneMode()) {
      hunter.presenceHits = PRESENCE_TIER_TWO_HITS;
      hunter.presenceTier = 2;
      hunter.nextSawDashAt = 0;
      hunter.shortSawAvailableUntil = 0;
      hunter.pendingSawWipe = false;
      hunter.pendingSawWipeAt = 0;
      hunter.status = "controlled";
      lanternAlert = {
        text: "娱乐模式 · 无限车移动靶",
        until: performance.now() + 1800
      };
      return;
    }

    if (isSoulBinderPracticeMode()) {
      hunter.presenceHits = PRESENCE_TIER_TWO_HITS;
      hunter.presenceTier = 2;
      hunter.nextBorrowSoulAt = 0;
      getSurvivors().forEach((survivor) => {
        if (!survivor.escaped && survivor.state !== "eliminated") survivor.soulMarks = SOUL_BINDER_PRACTICE_SOUL_MARKS;
      });
      lanternAlert = {
        text: "娱乐模式 · 20魂印无限借魂",
        until: performance.now() + 1800
      };
      return;
    }

    if (isKiteSimulatorMode()) {
      hunter.badges = getAIHunterBadges();
      applyHunterCharacter(selectedHunterCharacter);
      hunter.assistSkill = pickAIHunterAssist();
      hunter.target = player;
      lanternAlert = {
        text: `娱乐模式 · 牵制模拟器 · ${getHunterCharacter().name}`,
        until: performance.now() + 1800
      };
    }
  }

  function showCharacterSelection(role) {
    pendingRole = role;
    setupStep = "character";
    selectedCharacterForSetup = role === PLAYER_ROLE.hunter ? selectedHunterCharacter : selectedSurvivorCharacter;
    if (role === PLAYER_ROLE.hunter) prepareHunterSurvivorPreview();
    updateSetupTitle();
    if (roleActions) roleActions.classList.add("is-hidden");
    if (characterPanel) characterPanel.classList.remove("is-hidden");
    updateSetupPanels();
    updateHunterSurvivorPreview(role);
    updateHiddenUnlockPanel(role);
  }

  function showRoleSelection() {
    pendingRole = null;
    pendingMode = null;
    setupStep = "character";
    selectedCharacterForSetup = null;
    currentMode = GAME_MODE.normal;
    kiteSimulatorNoCooldown = false;
    if (roleDialogTitle) roleDialogTitle.textContent = "选择阵营";
    if (roleActions) roleActions.classList.remove("is-hidden");
    if (characterPanel) characterPanel.classList.add("is-hidden");
    updateHiddenUnlockPanel(null);
    updateBadgePanel(null);
    updateAssistPanel(null);
    updateKiteSimulatorOptions(false);
    updateHunterSurvivorPreview(null);
    updateSetupNextButton();
  }

  function prepareHunterSurvivorPreview() {
    previewSurvivorCharacterOrder = pickAICharacters(getSurvivors().length);
  }

  function updateHunterSurvivorPreview(role = pendingRole) {
    if (!hunterSurvivorPreview) return;
    const visible = role === PLAYER_ROLE.hunter && Array.isArray(previewSurvivorCharacterOrder);
    hunterSurvivorPreview.classList.toggle("is-hidden", !visible);
    if (!visible) return;
    const names = previewSurvivorCharacterOrder.slice(0, 4).map((id) => SURVIVOR_CHARACTERS[id] && SURVIVOR_CHARACTERS[id].name || id);
    hunterSurvivorPreview.innerHTML = `
      <strong>本局求生者身份</strong>
      <span>${names.map(escapeHtml).join(" · ")}</span>
    `;
  }

  function startMatch(role, characterId = null) {
    if (pendingMode !== GAME_MODE.kiteSimulator) {
      currentMode = GAME_MODE.normal;
    }
    if (role === PLAYER_ROLE.hunter && characterId === TWIN_SWORD_ID && shouldUseCharacterUnlocks() && !hiddenHunterUnlocked) {
      showCharacterSelection(role);
      return;
    }
    if (characterId && !isCharacterUnlocked(role, characterId)) {
      showCharacterSelection(role);
      return;
    }
    selectedRole = role;
    if (role === PLAYER_ROLE.survivor && characterId) selectedSurvivorCharacter = characterId;
    if (role === PLAYER_ROLE.hunter && characterId) selectedHunterCharacter = characterId;
    assignCharactersForMatch();
    resetMatch();
    beginPreparedMatch();
  }

  function selectCharacterForSetup(role, characterId) {
    if (role !== pendingRole) return;
    if (role === PLAYER_ROLE.hunter && characterId === TWIN_SWORD_ID && shouldUseCharacterUnlocks() && !hiddenHunterUnlocked) {
      showCharacterSelection(role);
      return;
    }
    if (!isCharacterUnlocked(role, characterId)) {
      if (roleDialogTitle) roleDialogTitle.textContent = getCharacterUnlockLabel(role, characterId);
      return;
    }
    selectedCharacterForSetup = characterId;
    if (role === PLAYER_ROLE.survivor) selectedSurvivorCharacter = characterId;
    if (role === PLAYER_ROLE.hunter) selectedHunterCharacter = characterId;
    if (pendingMode === GAME_MODE.kiteSimulator && role === PLAYER_ROLE.hunter) {
      startKiteSimulatorMode(selectedSurvivorCharacter, characterId);
      return;
    }
    setupStep = "badges";
    updateSetupTitle();
    updateSetupPanels();
  }

  function advanceSetupStep() {
    if (!pendingRole || !selectedCharacterForSetup) return;
    if (setupStep === "character") {
      setupStep = "badges";
      updateSetupTitle();
      updateSetupPanels();
      return;
    }
    if (setupStep === "badges" && pendingRole === PLAYER_ROLE.hunter) {
      setupStep = "assist";
      updateSetupTitle();
      updateSetupPanels();
      return;
    }
    if (pendingMode === GAME_MODE.kiteSimulator && pendingRole === PLAYER_ROLE.survivor) {
      showKiteSimulatorHunterSelection();
      return;
    }
    startMatch(pendingRole, selectedCharacterForSetup);
  }

  function backSetupStep() {
    if (pendingMode === GAME_MODE.kiteSimulator && pendingRole === PLAYER_ROLE.hunter && setupStep === "character") {
      pendingRole = PLAYER_ROLE.survivor;
      setupStep = "badges";
      selectedCharacterForSetup = selectedSurvivorCharacter;
      updateSetupTitle();
      updateSetupPanels();
      return;
    }
    if (setupStep === "assist") {
      setupStep = "badges";
      updateSetupTitle();
      updateSetupPanels();
      return;
    }
    if (setupStep === "badges") {
      setupStep = "character";
      updateSetupTitle();
      updateSetupPanels();
      return;
    }
    showRoleSelection();
  }

  function updateSetupTitle() {
    if (!roleDialogTitle || !pendingRole) return;
    const roleName = pendingRole === PLAYER_ROLE.hunter ? "追捕者" : "逃生者";
    if (pendingMode === GAME_MODE.kiteSimulator && setupStep === "character") roleDialogTitle.textContent = pendingRole === PLAYER_ROLE.hunter ? "牵制模拟器 · 选择人机追捕者" : "牵制模拟器 · 选择逃生者";
    else if (setupStep === "badges") roleDialogTitle.textContent = `选择${roleName}徽章`;
    else if (setupStep === "assist") roleDialogTitle.textContent = "选择辅助技能";
    else roleDialogTitle.textContent = `选择${roleName}`;
  }

  function updateSetupPanels() {
    const showCharacters = Boolean(pendingRole) && setupStep === "character";
    const showBadges = Boolean(pendingRole) && setupStep === "badges";
    const showAssist = pendingRole === PLAYER_ROLE.hunter && setupStep === "assist";
    const showKiteSimulatorOptions = showBadges && pendingMode === GAME_MODE.kiteSimulator && pendingRole === PLAYER_ROLE.survivor;
    characterButtons.forEach((button) => {
      const characterId = button.dataset.character;
      const hasUnlockTask = getCharacterUnlockTasks(button.dataset.characterRole, characterId).length > 0;
      const lockedHidden = button.dataset.hiddenCharacter === "true" && !hiddenHunterUnlocked && !developerUnlockAllCharacters && !hasUnlockTask;
      const visible = showCharacters && button.dataset.characterRole === pendingRole && !lockedHidden;
      const locked = visible && !isCharacterUnlocked(button.dataset.characterRole, characterId);
      const detail = button.querySelector("strong");
      if (detail && !button.dataset.defaultDetail) button.dataset.defaultDetail = detail.textContent;
      if (detail && visible) detail.textContent = locked ? getCharacterUnlockLabel(button.dataset.characterRole, characterId) : button.dataset.defaultDetail;
      button.classList.toggle("is-hidden", !visible);
      button.classList.toggle("is-locked", locked);
      button.classList.toggle("is-selected", visible && button.dataset.character === selectedCharacterForSetup);
      button.disabled = false;
      button.setAttribute("aria-disabled", locked ? "true" : "false");
      if (visible) button.title = locked ? getCharacterUnlockLabel(button.dataset.characterRole, characterId) : "";
    });
    updateHiddenUnlockPanel(showCharacters ? pendingRole : null);
    updateBadgePanel(showBadges ? pendingRole : null);
    updateAssistPanel(showAssist ? pendingRole : null);
    updateKiteSimulatorOptions(showKiteSimulatorOptions);
    updateSetupNextButton();
  }

  function updateKiteSimulatorOptions(visible) {
    if (!kiteSimulatorOptions || !kiteSimulatorNoCooldownButton) return;
    kiteSimulatorOptions.classList.toggle("is-hidden", !visible);
    kiteSimulatorNoCooldownButton.classList.toggle("is-selected", kiteSimulatorNoCooldown);
    kiteSimulatorNoCooldownButton.setAttribute("aria-pressed", kiteSimulatorNoCooldown ? "true" : "false");
  }

  function updateSetupNextButton() {
    if (!characterNextButton) return;
    const visible = Boolean(pendingRole) && setupStep !== "character";
    characterNextButton.classList.toggle("is-hidden", !visible);
    if (!visible) return;
    characterNextButton.textContent = pendingMode === GAME_MODE.kiteSimulator && pendingRole === PLAYER_ROLE.survivor
      ? "选择追捕者"
      : setupStep === "assist" || pendingRole === PLAYER_ROLE.survivor ? "开始游戏" : "下一步";
  }

  function startInfiniteSawboneMode() {
    currentMode = GAME_MODE.infiniteSawbone;
    selectedRole = PLAYER_ROLE.hunter;
    selectedHunterCharacter = SAWBONE_ID;
    selectedHunterBadges = [];
    selectedHunterAssist = null;
    assignCharactersForMatch();
    resetMatch();
    beginPreparedMatch();
  }

  function startSoulBinderPracticeMode() {
    currentMode = GAME_MODE.soulBinderPractice;
    selectedRole = PLAYER_ROLE.hunter;
    selectedHunterCharacter = SOUL_BINDER_ID;
    selectedHunterBadges = [];
    selectedHunterAssist = null;
    assignCharactersForMatch();
    resetMatch();
    beginPreparedMatch();
  }

  function startKiteSimulatorSetup() {
    currentMode = GAME_MODE.kiteSimulator;
    pendingMode = GAME_MODE.kiteSimulator;
    kiteSimulatorNoCooldown = false;
    showCharacterSelection(PLAYER_ROLE.survivor);
  }

  function showKiteSimulatorHunterSelection() {
    pendingRole = PLAYER_ROLE.hunter;
    setupStep = "character";
    selectedCharacterForSetup = selectedHunterCharacter;
    updateSetupTitle();
    updateSetupPanels();
    updateHunterSurvivorPreview(PLAYER_ROLE.hunter);
    updateHiddenUnlockPanel(PLAYER_ROLE.hunter);
  }

  function startKiteSimulatorMode(survivorCharacterId = null, hunterCharacterId = null) {
    currentMode = GAME_MODE.kiteSimulator;
    pendingMode = null;
    pendingRole = null;
    selectedRole = PLAYER_ROLE.survivor;
    if (survivorCharacterId) selectedSurvivorCharacter = survivorCharacterId;
    if (hunterCharacterId) selectedHunterCharacter = hunterCharacterId;
    assignCharactersForMatch();
    hunter.badges = getAIHunterBadges();
    applyHunterCharacter(selectedHunterCharacter);
    hunter.assistSkill = pickAIHunterAssist();
    resetMatch();
    beginPreparedMatch();
  }

  function restartCurrentMatch() {
    if (!selectedRole) return;
    if (isInfiniteSawboneMode()) applyHunterCharacter(SAWBONE_ID);
    else if (isSoulBinderPracticeMode()) applyHunterCharacter(SOUL_BINDER_ID);
    else if (isKiteSimulatorMode()) applyHunterCharacter(selectedHunterCharacter);
    else assignCharactersForMatch();
    resetMatch();
    beginPreparedMatch();
  }

  function setRoleOverlayVisible(visible) {
    if (!roleOverlay) return;
    roleOverlay.classList.toggle("is-hidden", !visible);
    if (characterCodexButton) characterCodexButton.hidden = !visible;
    if (!visible) setCharacterCodexVisible(false);
    else showRoleSelection();
  }

  function getCharacterCodexConfig(role, characterId) {
    const characters = role === PLAYER_ROLE.hunter ? HUNTER_CHARACTERS : SURVIVOR_CHARACTERS;
    return characters[characterId] || null;
  }

  function getCharacterCodexImageKey(role, characterId) {
    if (role === PLAYER_ROLE.hunter && characterId === TWIN_SWORD_ID) return "twinQingtian";
    return CHARACTER_IMAGES[characterId] ? characterId : null;
  }

  function getHunterCodexAttackDescription(characterId) {
    const character = HUNTER_CHARACTERS[characterId];
    if (!character) return "普攻刀气：使用当前追捕者的基础攻击参数。";
    const lunge = character.attackLunge ? `，攻击位移 ${character.attackLunge}` : "";
    const hitRecovery = Math.round(HUNTER_HIT_RECOVERY * (character.hitRecovery || 1) / 10) / 100;
    const missRecovery = Math.round(HUNTER_MISS_RECOVERY * (character.missRecovery || 1)) / 1000;
    return `普攻刀气：攻击范围 ${character.attackRange}，抬手 ${(character.attackWindup || 0).toFixed(2)} 秒${lunge}；命中擦刀约 ${hitRecovery.toFixed(2)} 秒，空刀后摇约 ${missRecovery.toFixed(2)} 秒。`;
  }

  function getCharacterCodexPortrait(role, characterId, character) {
    const imageKey = getCharacterCodexImageKey(role, characterId);
    const image = imageKey && CHARACTER_IMAGES[imageKey];
    if (image) {
      return `<div class="character-codex-portrait"><img src="${escapeHtml(image.src)}" alt="${escapeHtml(character.name)}局内造型"></div>`;
    }
    const fill = character.fill || (role === PLAYER_ROLE.hunter ? "#8f4f45" : "#64748b");
    const core = character.core || (role === PLAYER_ROLE.hunter ? "#ffd5cd" : "#d9b76a");
    return `<div class="character-codex-portrait character-codex-portrait-placeholder" style="--codex-fill:${fill};--codex-core:${core}" aria-label="${escapeHtml(character.name)}当前局内基础造型"><span>${escapeHtml(character.name.slice(0, 1))}</span></div>`;
  }

  function getCharacterCodexAttackVisual(role, characterId, character, attack) {
    if (role !== PLAYER_ROLE.hunter) return `<p>${escapeHtml(attack)}</p>`;
    const imageKey = getCharacterCodexImageKey(role, characterId);
    const image = imageKey && CHARACTER_IMAGES[imageKey];
    const portrait = image
      ? `<img class="character-codex-attack-hunter" src="${escapeHtml(image.src)}" alt="${escapeHtml(character.name)}局内模型">`
      : `<span class="character-codex-attack-placeholder" aria-hidden="true">${escapeHtml(character.name.slice(0, 1))}</span>`;
    return `<figure class="character-codex-attack-visual" aria-label="${escapeHtml(attack)}">
      <div class="character-codex-attack-stage">
        <canvas class="character-codex-attack-canvas" data-attack-range="${character.attackRange}" data-attack-arc="${character.attackArc || Math.PI}" aria-hidden="true"></canvas>
        ${portrait}
      </div>
      <figcaption>红色半圆为实际普攻判定；每格约 2 米。${escapeHtml(attack)}</figcaption>
    </figure>`;
  }

  function drawCharacterCodexAttackDiagram(character) {
    const canvas = characterCodexDetail && characterCodexDetail.querySelector(".character-codex-attack-canvas");
    if (!canvas || !character || !Number.isFinite(character.attackRange)) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return;
    const ratio = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    const diagramCtx = canvas.getContext("2d");
    diagramCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
    diagramCtx.clearRect(0, 0, rect.width, rect.height);

    const gridSize = 46;
    const originX = 62;
    const originY = rect.height / 2;
    const scale = gridSize / world.tile;
    const radius = character.attackRange * scale;
    const halfArc = (character.attackArc || Math.PI) / 2;

    diagramCtx.fillStyle = "#0d140f";
    diagramCtx.fillRect(0, 0, rect.width, rect.height);
    diagramCtx.strokeStyle = "rgba(183, 214, 193, 0.14)";
    diagramCtx.lineWidth = 1;
    for (let x = originX % gridSize; x <= rect.width; x += gridSize) {
      diagramCtx.beginPath();
      diagramCtx.moveTo(x, 0);
      diagramCtx.lineTo(x, rect.height);
      diagramCtx.stroke();
    }
    for (let y = originY % gridSize; y <= rect.height; y += gridSize) {
      diagramCtx.beginPath();
      diagramCtx.moveTo(0, y);
      diagramCtx.lineTo(rect.width, y);
      diagramCtx.stroke();
    }

    diagramCtx.save();
    diagramCtx.translate(originX, originY);
    diagramCtx.fillStyle = "rgba(185, 95, 82, 0.28)";
    diagramCtx.strokeStyle = "rgba(221, 104, 91, 0.92)";
    diagramCtx.lineWidth = 2;
    diagramCtx.beginPath();
    diagramCtx.moveTo(0, 0);
    diagramCtx.arc(0, 0, radius, -halfArc, halfArc);
    diagramCtx.closePath();
    diagramCtx.fill();
    diagramCtx.stroke();
    diagramCtx.restore();

    diagramCtx.fillStyle = "rgba(238, 243, 237, 0.78)";
    diagramCtx.font = "700 11px ui-sans-serif, system-ui";
    diagramCtx.textAlign = "left";
    diagramCtx.fillText(`${(character.attackRange / world.tile).toFixed(1)} 格`, Math.min(rect.width - 42, originX + radius + 8), Math.max(15, originY - 8));
  }

  function renderCharacterCodex() {
    if (!characterCodexList || !characterCodexDetail) return;
    const guides = CHARACTER_GUIDE[characterCodexRole] || {};
    const characterIds = Object.keys(guides);
    if (!characterIds.includes(characterCodexCharacterId)) characterCodexCharacterId = characterIds[0] || "";
    const character = getCharacterCodexConfig(characterCodexRole, characterCodexCharacterId);
    const guide = guides[characterCodexCharacterId];
    if (!character || !guide) return;

    characterCodexTabs.forEach((tab) => {
      const selected = tab.dataset.codexRole === characterCodexRole;
      tab.classList.toggle("is-selected", selected);
      tab.setAttribute("aria-selected", selected ? "true" : "false");
    });
    characterCodexList.innerHTML = characterIds.map((characterId) => {
      const item = getCharacterCodexConfig(characterCodexRole, characterId);
      const selected = characterId === characterCodexCharacterId;
      const label = characterCodexRole === PLAYER_ROLE.survivor ? item.roleTag : "追捕者";
      return `<button type="button" class="character-codex-list-item${selected ? " is-selected" : ""}" data-codex-character="${escapeHtml(characterId)}" aria-pressed="${selected ? "true" : "false"}">
        <span>${escapeHtml(item.name)}</span><strong>${escapeHtml(label)}</strong>
      </button>`;
    }).join("");

    const attack = characterCodexRole === PLAYER_ROLE.hunter
      ? getHunterCodexAttackDescription(characterCodexCharacterId)
      : guide.attack;
    const label = characterCodexRole === PLAYER_ROLE.survivor ? character.roleTag : "追捕者";
    characterCodexDetail.innerHTML = `
      <div class="character-codex-identity">
        ${getCharacterCodexPortrait(characterCodexRole, characterCodexCharacterId, character)}
        <div>
          <span class="character-codex-role">${escapeHtml(label)}</span>
          <h3>${escapeHtml(character.name)}</h3>
          <p>${escapeHtml(guide.overview)}</p>
        </div>
      </div>
      <section class="character-codex-section">
        <h4>局内造型</h4>
        <p>${escapeHtml(guide.style)}</p>
      </section>
      <section class="character-codex-section">
        <h4>普攻刀气</h4>
        ${getCharacterCodexAttackVisual(characterCodexRole, characterCodexCharacterId, character, attack)}
      </section>
      <section class="character-codex-section character-codex-skills">
        <h4>技能</h4>
        <div>${guide.skills.map((skill) => `<div class="character-codex-skill"><span>${escapeHtml(skill.key)}</span><strong>${escapeHtml(skill.name)}</strong><p>${escapeHtml(skill.description)}</p></div>`).join("")}</div>
      </section>
    `;
    if (characterCodexRole === PLAYER_ROLE.hunter) requestAnimationFrame(() => drawCharacterCodexAttackDiagram(character));
  }

  function setCharacterCodexVisible(visible) {
    if (!characterCodexOverlay) return;
    if (visible && matchStarted) return;
    characterCodexOverlay.classList.toggle("is-hidden", !visible);
    characterCodexOverlay.setAttribute("aria-hidden", visible ? "false" : "true");
    if (visible) renderCharacterCodex();
  }

  function readHiddenHunterUnlock() {
    try {
      return window.localStorage.getItem(HIDDEN_HUNTER_UNLOCK_KEY) === "true";
    } catch (error) {
      return false;
    }
  }

  function saveHiddenHunterUnlock() {
    try {
      window.localStorage.setItem(HIDDEN_HUNTER_UNLOCK_KEY, "true");
    } catch (error) {
      // 本地存储不可用时，本次页面会话内仍然解锁。
    }
  }

  function readDeveloperUnlockMode() {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.has(DEVELOPER_MODE_QUERY_KEY) || params.get("mode") === "dev" || window.location.hash === "#dev";
    } catch (error) {
      return false;
    }
  }

  function getDefaultProfileUnlocks() {
    return {
      survivor: INITIAL_UNLOCKS.survivor.slice(),
      hunter: INITIAL_UNLOCKS.hunter.slice()
    };
  }

  function readProfileUnlocks() {
    const defaults = getDefaultProfileUnlocks();
    try {
      const saved = JSON.parse(window.localStorage.getItem(PROFILE_UNLOCK_STORAGE_KEY) || "{}");
      return {
        survivor: mergeUnique(defaults.survivor, Array.isArray(saved.survivor) ? saved.survivor : []),
        hunter: mergeUnique(defaults.hunter, Array.isArray(saved.hunter) ? saved.hunter : [])
      };
    } catch (error) {
      return defaults;
    }
  }

  function saveProfileUnlocks() {
    try {
      window.localStorage.setItem(PROFILE_UNLOCK_STORAGE_KEY, JSON.stringify(profileUnlocks));
    } catch (error) {
      // 本地存档不可用时，本次会话内仍然保留解锁。
    }
  }

  function readProfileTaskProgress() {
    const progress = {};
    Object.values(CHARACTER_UNLOCK_TASKS).forEach((task) => {
      progress[task.progressKey] = 0;
    });
    try {
      const saved = JSON.parse(window.localStorage.getItem(PROFILE_TASK_STORAGE_KEY) || "{}");
      Object.keys(progress).forEach((key) => {
        progress[key] = Math.max(0, Number(saved[key]) || 0);
      });
    } catch (error) {
      // 使用默认任务进度。
    }
    return progress;
  }

  function saveProfileTaskProgress() {
    try {
      window.localStorage.setItem(PROFILE_TASK_STORAGE_KEY, JSON.stringify(profileTaskProgress));
    } catch (error) {
      // 本地存档不可用时，本次会话内仍然保留任务进度。
    }
  }

  function mergeUnique(...lists) {
    return [...new Set(lists.flat().filter(Boolean))];
  }

  function isCharacterUnlocked(role, characterId) {
    if (developerUnlockAllCharacters) return true;
    return Boolean(profileUnlocks[role] && profileUnlocks[role].includes(characterId));
  }

  function shouldUseCharacterUnlocks() {
    return !developerUnlockAllCharacters;
  }

  function getCharacterUnlockTask(role, characterId) {
    return getCharacterUnlockTasks(role, characterId)[0] || null;
  }

  function getCharacterUnlockTasks(role, characterId) {
    return Object.values(CHARACTER_UNLOCK_TASKS).filter((task) => task.role === role && task.target === characterId);
  }

  function getCharacterUnlockLabel(role, characterId) {
    const tasks = getCharacterUnlockTasks(role, characterId);
    if (tasks.length === 0) return "未解锁";
    const task = tasks.find((item) => !isUnlockTaskComplete(item)) || tasks[tasks.length - 1];
    const progress = Math.min(task.goal, profileTaskProgress[task.progressKey] || 0);
    const readout = task.progressKey === "kiteSeconds" ? `${Math.floor(progress)}/${task.goal}秒` : `${Math.floor(progress)}/${task.goal}`;
    const prefix = tasks.length > 1 ? `${tasks.findIndex((item) => item === task) + 1}/${tasks.length} ` : "";
    return `${prefix}${task.label} ${readout}`;
  }

  function isUnlockTaskComplete(task) {
    return (profileTaskProgress[task.progressKey] || 0) >= task.goal;
  }

  function areCharacterUnlockTasksComplete(role, characterId) {
    const tasks = getCharacterUnlockTasks(role, characterId);
    return tasks.length > 0 && tasks.every(isUnlockTaskComplete);
  }

  function unlockCharacter(role, characterId) {
    if (!profileUnlocks[role]) profileUnlocks[role] = [];
    if (profileUnlocks[role].includes(characterId)) return false;
    profileUnlocks[role].push(characterId);
    saveProfileUnlocks();
    updateSetupPanels();
    return true;
  }

  function addUnlockTaskProgress(progressKey, amount = 1) {
    if (!shouldUseCharacterUnlocks()) return;
    const task = Object.values(CHARACTER_UNLOCK_TASKS).find((item) => item.progressKey === progressKey);
    if (!task || isCharacterUnlocked(task.role, task.target)) return;
    const current = Math.max(0, profileTaskProgress[progressKey] || 0);
    profileTaskProgress[progressKey] = Math.min(task.goal, current + amount);
    saveProfileTaskProgress();
    if (areCharacterUnlockTasksComplete(task.role, task.target) && unlockCharacter(task.role, task.target)) {
      showAssistAlert(`解锁 ${getCharacterName(task.role, task.target)}`, performance.now(), 1600);
    }
  }

  function getCharacterName(role, characterId) {
    const config = role === PLAYER_ROLE.hunter ? HUNTER_CHARACTERS[characterId] : SURVIVOR_CHARACTERS[characterId];
    return config && config.name || characterId;
  }

  function trackPlayerHealTeammate(target) {
    if (selectedRole !== PLAYER_ROLE.survivor || target === player) return;
    addUnlockTaskProgress("healTeammate", 1);
  }

  function isNormalHunterUnlockMatch() {
    return shouldUseCharacterUnlocks() && selectedRole === PLAYER_ROLE.hunter && currentMode === GAME_MODE.normal;
  }

  function isNormalSurvivorUnlockMatch() {
    return shouldUseCharacterUnlocks() && selectedRole === PLAYER_ROLE.survivor && currentMode === GAME_MODE.normal;
  }

  function trackHunterTierOneUnlock(now) {
    if (!isNormalHunterUnlockMatch()) return;
    if (now - matchStartedAt <= 60000) addUnlockTaskProgress("hunterTierOne60", 1);
  }

  function trackHunterFirstHitDownUnlock(survivor, now, wasDowned) {
    if (!isNormalHunterUnlockMatch() || !survivor || survivor.escaped || survivor.state === "eliminated") return;
    if (!hunter.unlockFirstHitRecords) hunter.unlockFirstHitRecords = new Map();
    if (!hunter.unlockFirstHitRecords.has(survivor)) hunter.unlockFirstHitRecords.set(survivor, now);
    const firstHitAt = hunter.unlockFirstHitRecords.get(survivor);
    if (!wasDowned && survivor.state === "downed" && now - firstHitAt <= 20000) {
      addUnlockTaskProgress("firstHitDown20", 1);
    }
  }

  function trackHunterDownUnlock(survivor, now, wasDowned) {
    if (!isNormalHunterUnlockMatch() || !survivor || wasDowned || survivor.state !== "downed") return;
    addUnlockTaskProgress("hunterDown", 1);
  }

  function trackHunterRemoteDownUnlock(survivor, now, wasDowned, options = {}) {
    if (!isNormalHunterUnlockMatch() || !survivor || wasDowned || survivor.state !== "downed") return;
    if (options.basicAttack) return;
    if (distanceBetween(hunter, survivor) >= 260) addUnlockTaskProgress("remoteHunterDown", 1);
  }

  function trackHunterSkillUseUnlock(now) {
    if (!isNormalHunterUnlockMatch()) return;
    if (hunter.lastUnlockSkillUseAt && now - hunter.lastUnlockSkillUseAt <= 5000) {
      addUnlockTaskProgress("hunterSkillBurst5", 1);
    }
    hunter.lastUnlockSkillUseAt = now;
  }

  function trackHunterFourKillUnlock(winner) {
    if (!isNormalHunterUnlockMatch() || winner !== "hunter") return;
    const eliminatedCount = getSurvivors().filter((survivor) => survivor.state === "eliminated").length;
    if (eliminatedCount >= 4 && getCompletedRepairCount() === 0) addUnlockTaskProgress("fiveCipherFourKill", 1);
  }

  function trackMirrorGhostEndgameUnlock(winner) {
    if (!isNormalHunterUnlockMatch() || winner !== "hunter") return;
    if (hunter.mirrorEndgameFourSafe) addUnlockTaskProgress("mirrorEndgameFourSafeWin", 1);
  }

  function trackDancerBlinkDownUnlock(survivor, now, wasDowned, options = {}) {
    if (!isNormalHunterUnlockMatch() || !options.basicAttack) return;
    if (!survivor || wasDowned || survivor.state !== "downed" || now > (hunter.blinkDownEligibleUntil || 0)) return;
    hunter.blinkDownEligibleUntil = 0;
    addUnlockTaskProgress("dancerBlinkDown", 1);
  }

  function trackTunerFirstCipherUnlock(point) {
    if (!isNormalSurvivorUnlockMatch() || tunerFirstCipherBeforeInjuryRecorded || firstSurvivorInjuryOccurred) return;
    if (!point.workers.includes(player)) return;
    tunerFirstCipherBeforeInjuryRecorded = true;
    addUnlockTaskProgress("tunerFirstCipherBeforeInjury", 1);
  }

  function trackFighterPalletStunUnlock(actor) {
    if (!isNormalSurvivorUnlockMatch() || actor !== player) return;
    addUnlockTaskProgress("fighterPalletStun", 1);
  }

  function trackPlayerRescue(rescuer, target, now) {
    if (selectedRole !== PLAYER_ROLE.survivor || rescuer !== player || !target || target === player) return;
    addUnlockTaskProgress("rescue", 1);
    if (player.state === "injured") addUnlockTaskProgress("injuredRescue", 1);
    pendingSafeRescueTasks.push({
      target,
      until: now + 30000
    });
  }

  function updateUnlockTaskRuntime(now, dt) {
    if (!shouldUseCharacterUnlocks()) return;
    if (selectedRole !== PLAYER_ROLE.survivor || !matchStarted) return;
    updatePlayerKiteAndChaseEscapeTasks(now, dt);
    updateSafeRescueTasks(now);
  }

  function updatePlayerKiteAndChaseEscapeTasks(now, dt) {
    const active = player && !player.escaped && (player.state === "healthy" || player.state === "injured");
    const chased = active && hunter.target === player && distanceBetween(player, hunter) < 760;
    if (chased) {
      addUnlockTaskProgress("kiteSeconds", dt);
      if (!playerChaseTaskState) {
        playerChaseTaskState = { lastChasedAt: now };
      } else {
        playerChaseTaskState.lastChasedAt = now;
      }
      return;
    }
    if (!playerChaseTaskState) return;
    if (!active) {
      playerChaseTaskState = null;
      return;
    }
    if (now - playerChaseTaskState.lastChasedAt >= 2500) {
      addUnlockTaskProgress("escapeChase", 1);
      playerChaseTaskState = null;
    }
  }

  function updateSafeRescueTasks(now) {
    for (let index = pendingSafeRescueTasks.length - 1; index >= 0; index -= 1) {
      const task = pendingSafeRescueTasks[index];
      const target = task.target;
      if (!target || target.state === "downed" || target.state === "carried" || target.state === "seated" || target.state === "eliminated") {
        pendingSafeRescueTasks.splice(index, 1);
        continue;
      }
      if (now >= task.until) {
        addUnlockTaskProgress("safeRescue", 1);
        pendingSafeRescueTasks.splice(index, 1);
      }
    }
  }

  function unlockHiddenHunter() {
    hiddenHunterUnlocked = true;
    saveHiddenHunterUnlock();
    updateSetupPanels();
    if (hiddenCodeInput) hiddenCodeInput.value = "";
    if (roleDialogTitle && pendingRole === PLAYER_ROLE.hunter) roleDialogTitle.textContent = "选择追捕者 · 隐藏角色已解锁";
  }

  function updateHiddenUnlockPanel(role) {
    if (!hiddenUnlockForm) return;
    hiddenUnlockForm.classList.toggle("is-hidden", !shouldUseCharacterUnlocks() || role !== PLAYER_ROLE.hunter || hiddenHunterUnlocked);
  }

  function submitHiddenHunterCode(event) {
    event.preventDefault();
    if (!shouldUseCharacterUnlocks() || !hiddenCodeInput || pendingRole !== PLAYER_ROLE.hunter || hiddenHunterUnlocked) return;
    const code = hiddenCodeInput.value.trim().toLowerCase();
    if (code === HIDDEN_HUNTER_UNLOCK_CODE) {
      unlockHiddenHunter();
      return;
    }
    hiddenCodeInput.value = "";
    hiddenCodeInput.focus();
    if (roleDialogTitle) roleDialogTitle.textContent = "选择追捕者 · 暗号不对";
  }

  function handleHiddenCharacterUnlockKey(key) {
    if (!shouldUseCharacterUnlocks()) return;
    if (!roleOverlay || roleOverlay.classList.contains("is-hidden")) return;
    if (!characterPanel || characterPanel.classList.contains("is-hidden")) return;
    if (pendingRole !== PLAYER_ROLE.hunter || hiddenHunterUnlocked) return;
    if (!key || key.length !== 1 || !/[a-z]/i.test(key)) return;

    hiddenUnlockBuffer = `${hiddenUnlockBuffer}${key.toLowerCase()}`.slice(-HIDDEN_HUNTER_UNLOCK_CODE.length);
    if (hiddenUnlockBuffer === HIDDEN_HUNTER_UNLOCK_CODE) unlockHiddenHunter();
  }

  function updateBadgePanel(role) {
    if (!badgePanel) return;
    badgePanel.classList.toggle("is-hidden", !role);
    const selected = role ? getSelectedBadgesForRole(role) : [];
    const purpleCount = role ? countBadgesByRarity(role, selected, "purple") : 0;
    const blueCount = role ? countBadgesByRarity(role, selected, "blue") : 0;
    if (badgeLimitReadout) badgeLimitReadout.textContent = `紫 ${purpleCount}/${BADGE_LIMITS.purple} · 蓝 ${blueCount}/${BADGE_LIMITS.blue}`;
    badgeButtons.forEach((button) => {
      const buttonRole = button.dataset.badgeRole;
      const rarity = button.dataset.badgeRarity || getBadgeRarity(buttonRole, button.dataset.badge);
      const selectedHere = selected.includes(button.dataset.badge);
      const limitReached = role && countBadgesByRarity(role, selected, rarity) >= (BADGE_LIMITS[rarity] || 0);
      button.classList.toggle("is-hidden", buttonRole !== role);
      button.classList.toggle("is-selected", selectedHere);
      button.disabled = buttonRole === role && !selectedHere && limitReached;
    });
  }

  function toggleBadgeSelection(role, badgeId) {
    if (!BADGE_CONFIG[role] || !BADGE_CONFIG[role][badgeId]) return;
    const selected = getSelectedBadgesForRole(role);
    const existingIndex = selected.indexOf(badgeId);
    if (existingIndex >= 0) {
      selected.splice(existingIndex, 1);
    } else {
      const rarity = getBadgeRarity(role, badgeId);
      const limit = BADGE_LIMITS[rarity] || 0;
      if (countBadgesByRarity(role, selected, rarity) >= limit) {
        updateBadgePanel(role);
        return;
      }
      selected.push(badgeId);
    }
    updateBadgePanel(role);
  }

  function updateAssistPanel(role) {
    if (!assistPanel) return;
    const visible = role === PLAYER_ROLE.hunter;
    assistPanel.classList.toggle("is-hidden", !visible);
    if (assistLimitReadout) assistLimitReadout.textContent = visible ? `已选 ${getHunterAssistName(selectedHunterAssist)}` : "携带 1 个";
    assistButtons.forEach((button) => {
      const selectedHere = button.dataset.assist === selectedHunterAssist;
      button.classList.toggle("is-hidden", !visible);
      button.classList.toggle("is-selected", selectedHere);
    });
  }

  function selectHunterAssist(assistId) {
    if (!HUNTER_ASSIST_SKILLS[assistId]) return;
    selectedHunterAssist = assistId;
    updateAssistPanel(pendingRole);
  }

  function resetSurvivor(survivor, spawn) {
    survivor.x = spawn ? spawn.x : survivor.initialX;
    survivor.y = spawn ? spawn.y : survivor.initialY;
    survivor.vx = 0;
    survivor.vy = 0;
    survivor.stamina = 100;
    survivor.angle = 0;
    survivor.state = "healthy";
    survivor.healProgress = 0;
    survivor.damageProgress = 0;
    survivor.selfHealUsed = false;
    survivor.bleedStacks = [];
    survivor.soulMarks = 0;
    survivor.danceErosion = 0;
    survivor.shackleValue = 0;
    survivor.lastShackleAt = 0;
    survivor.shackledUntil = 0;
    survivor.chairProgress = 0;
    survivor.chairProgressPausedUntil = 0;
    survivor.injuredAt = null;
    survivor.downedAt = null;
    survivor.nextChairEliminates = false;
    survivor.carryProgress = 0;
    survivor.chair = null;
    survivor.escaped = false;
    survivor.boostUntil = 0;
    survivor.endgameBoostUntil = 0;
    survivor.adrenalineTriggered = false;
    survivor.borrowedTimeUntil = 0;
    survivor.borrowedTimePendingDamage = 0;
    survivor.borrowedTimeUsed = false;
    survivor.nextPhysicianBenevolenceAt = 0;
    survivor.medicShieldUntil = 0;
    survivor.medicShieldHits = 0;
    survivor.medicShieldSource = null;
    survivor.medicAdrenalineUntil = 0;
    survivor.medicAdrenalinePendingDamage = 0;
    survivor.medicRescueShockPendingDamage = 0;
    survivor.stitchPack = null;
    survivor.timeDevice = null;
    survivor.invisibleUntil = 0;
    survivor.listenRevealUntil = 0;
    survivor.assistRevealUntil = 0;
    survivor.patrollerHoldUntil = 0;
    survivor.patrollerSlowUntil = 0;
    survivor.edictStunnedUntil = 0;
    survivor.houndStunnedUntil = 0;
    survivor.hammerVaultLockedUntil = 0;
    survivor.edictViolationStacks = 0;
    survivor.edictViolationUntil = 0;
    survivor.edictHookSlowUntil = 0;
    survivor.hammerVaultSlowUntil = 0;
    survivor.abyssWhisperUntil = 0;
    survivor.abyssStaggerUntil = 0;
    survivor.abyssConfusedUntil = 0;
    survivor.action = null;
    survivor.nextPackageAt = 0;
    survivor.nextNavigationChannelAt = 0;
    survivor.nextNavigationChannelRideAt = 0;
    survivor.nextTimeRewindAt = 0;
    survivor.nextMagicShowAt = 0;
    survivor.nextRescuePhantomAt = 0;
    survivor.nextStitchPackAt = 0;
    survivor.nextPerfumeMistAt = 0;
    survivor.nextTunerEchoAt = 0;
    survivor.nextTunerCipherTuneAt = 0;
    survivor.nextTunerSorrowCalibrationAt = 0;
    survivor.nextFencerLungeAt = 0;
    survivor.nextFighterPunchAt = 0;
    survivor.fighterPunchStunCount = 0;
    survivor.fighterArenaUsed = false;
    survivor.antiqueFluteOpen = false;
    survivor.antiqueDurability = ANTIQUE_FLUTE_DURABILITY_MAX;
    survivor.antiqueFluteLockedUntil = 0;
    survivor.nextAntiqueSweepLeftAt = 0;
    survivor.nextAntiqueThrustAt = 0;
    survivor.nextAntiqueSweepRightAt = 0;
    survivor.nextAntiqueLeapAt = 0;
    survivor.nextAntiqueSprintAt = 0;
    survivor.antiqueSprintUntil = 0;
    survivor.antiqueLastWallHitAt = 0;
    survivor.antiqueWallCombo = 0;
    survivor.antiqueWallStopTier = 0;
    survivor.nextMedicAdrenalineAt = 0;
    survivor.nextFlywheelAt = 0;
    survivor.nextKneeJerkWindowAt = 0;
    survivor.nextKneeJerkPalletAt = 0;
    survivor.kneeJerkBoostUntil = 0;
    survivor.nextGeneralRideAt = 0;
    survivor.generalRideUntil = 0;
    survivor.generalRideWhips = 0;
    survivor.nextGeneralWhipAt = 0;
    survivor.generalRage = 0;
    survivor.nextShieldGuardAt = 0;
    survivor.shieldGuardUntil = 0;
    survivor.nextShieldToughnessAt = 0;
    survivor.shieldTwinTimeImmuneUntil = 0;
    survivor.mirrorTeleportReadyAt = 0;
    survivor.mirrorBlindUntil = 0;
    survivor.mirrorNoHeartbeatSince = 0;
    survivor.perfumeBoostUntil = 0;
    survivor.perfumeUltimateCharges = 0;
    survivor.tunerResonance = 0;
    survivor.fencerStrideMarks = [];
    survivor.fencerLastSprintAngle = null;
    survivor.fencerNextStrideAt = 0;
    survivor.fencerLungePreparing = false;
    survivor.fencerLungePreparingAt = 0;
    survivor.magicShowMode = "rescue";
    survivor.path = [];
    survivor.pathGoal = null;
    survivor.repathAt = 0;
    survivor.kiteDecision = null;
    survivor.healDecision = null;
    survivor.objectiveDecision = null;
    survivor.messengerSupport = null;
    survivor.quickChatDirective = null;
    survivor.navigationChannelDirective = null;
    survivor.kiteEscapeOverride = null;
    survivor.aiTask = null;
    survivor.palletMindgame = null;
    survivor.aiHitRecoveryRescue = null;
    survivor.aiPathStall = null;
    if (survivor.kind === "ai") {
      survivor.nextInteractAt = 0;
      survivor.wanderTarget = pickWanderTarget();
    }
  }

  function pickSurvivorSpawns(survivors) {
    const anchors = shuffled(getKiteSpawnAnchors());
    const spawns = [];
    survivors.forEach((survivor, index) => {
      const anchor = anchors.find((item) => isFarFromAll(item, spawns, 420)) || anchors[index % anchors.length];
      spawns.push(pickSpawnNearKiteAnchor(anchor, spawns, 280, survivor.radius));
    });
    return spawns;
  }

  function pickHunterSpawn(survivorSpawns) {
    const candidates = getSpawnCandidates(hunter.radius);
    return pickHighScoreSpawn(candidates, survivorSpawns, 620, hunter.radius);
  }

  function getKiteSpawnAnchors() {
    return windows.concat(pallets.filter((pallet) => pallet.label !== "broken"));
  }

  function pickSpawnNearKiteAnchor(anchor, exclusions, minDistance, radius) {
    const candidates = getSpawnCandidates(radius)
      .filter((point) => {
        const anchorDistance = distanceBetween(point, anchor);
        return anchorDistance >= 100 && anchorDistance <= 300;
      });
    return pickHighScoreSpawn(candidates, exclusions, minDistance, radius, anchor);
  }

  function pickHighScoreSpawn(candidates, exclusions, minDistance, radius, anchor = null) {
    const relaxedDistances = [minDistance, minDistance * 0.78, minDistance * 0.55, 0];
    for (const requiredDistance of relaxedDistances) {
      const validCandidates = candidates.filter((point) => isFarFromAll(point, exclusions, requiredDistance));
      if (validCandidates.length > 0) {
        const best = validCandidates
          .map((point) => ({ point, score: scoreSpawnPoint(point, exclusions, anchor) + Math.random() * 120 }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 8);
        return best[Math.floor(Math.random() * best.length)].point;
      }
    }

    return getFallbackSpawn(radius);
  }

  function getSpawnCandidates(radius) {
    const candidates = [];
    for (let row = 1; row < nav.rows - 1; row += 1) {
      for (let col = 1; col < nav.cols - 1; col += 1) {
        const point = cellToWorld({ col, row });
        if (isSafePosition(point.x, point.y, radius + 8)) candidates.push(point);
      }
    }
    return shuffled(candidates);
  }

  function scoreSpawnPoint(point, exclusions, anchor) {
    const separation = exclusions.length === 0
      ? 420
      : Math.min(...exclusions.map((other) => distanceBetween(point, other)));
    if (!anchor) return separation;
    const anchorDistance = distanceBetween(point, anchor);
    const kiteBonus = 220 - Math.abs(anchorDistance - 170);
    return separation + kiteBonus * 1.8;
  }

  function getFallbackSpawn(radius) {
    const candidates = getSpawnCandidates(radius);
    if (candidates.length > 0) return candidates[Math.floor(Math.random() * candidates.length)];
    return findNearestSafePosition(world.width / 2, world.height / 2, radius);
  }

  function isFarFromAll(point, others, minDistance) {
    return others.every((other) => distanceBetween(point, other) >= minDistance);
  }

  function shuffled(items) {
    const result = items.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
  }

  function pickWeighted(items, weights, fallback = null) {
    const weightedItems = items
      .map((item) => ({ item, weight: Math.max(0, Number(weights && weights[item]) || 0) }))
      .filter((entry) => entry.weight > 0);
    const total = weightedItems.reduce((sum, entry) => sum + entry.weight, 0);
    if (total <= 0) return fallback || items[0] || null;
    let roll = Math.random() * total;
    for (const entry of weightedItems) {
      roll -= entry.weight;
      if (roll <= 0) return entry.item;
    }
    return weightedItems[weightedItems.length - 1].item;
  }

  function handlePlayerInteraction(now) {
    if (selectedRole === PLAYER_ROLE.hunter) {
      if (isFighterArenaParticipant(hunter)) return;
      handleHunterInteraction(now);
      return;
    }

    if (!matchStarted || selectedRole !== PLAYER_ROLE.survivor) return;
    if (isFighterArenaParticipant(player)) return;
    if (player.state !== "healthy" && player.state !== "injured" || player.action) return;

    const standingPallet = findNearestPallet(player, "standing", SURVIVOR_PALLET_PROMPT_RANGE);
    if (standingPallet && !isShieldBearerGuarding(player, now)) {
      dropPallet(player, standingPallet, now);
      return;
    }

    const droppedPallet = findNearestPallet(player, "dropped", SURVIVOR_PALLET_PROMPT_RANGE);
    if (droppedPallet) {
      startVault(player, droppedPallet, getSurvivorVaultDuration(player, 260), now, "vaulting");
      return;
    }

    const nearWindow = findNearestWindow(player, SURVIVOR_WINDOW_PROMPT_RANGE);
    if (nearWindow) {
      startVault(player, nearWindow, getSurvivorVaultDuration(player, 320), now, "vaulting");
    }
  }

  function handleHunterInteraction(now) {
    if (!matchStarted || hunter.action || now < hunter.stunnedUntil || now < hunter.wipeUntil) return;

    if (hunter.carrying) {
      const chairTarget = findNearestEmptyChair(hunter, 116);
      if (chairTarget) {
        startChairSurvivor(hunter.carrying, chairTarget, now);
        return;
      }
    } else {
      const downedSurvivor = findNearestDownedSurvivor(hunter, 112);
      if (downedSurvivor) {
        startPickupSurvivor(downedSurvivor, now);
        return;
      }
    }

    const droppedPallet = findNearestPallet(hunter, "dropped", HUNTER_PALLET_PROMPT_RANGE);
    if (droppedPallet) {
      startBreakPallet(droppedPallet, now);
      return;
    }

    const navigationChannel = findNearestNavigationChannel(hunter, NAVIGATION_CHANNEL_DISMANTLE_RANGE);
    if (navigationChannel) {
      startDismantleNavigationChannel(navigationChannel, now);
      return;
    }

    const nearWindow = findNearestWindow(hunter, HUNTER_WINDOW_PROMPT_RANGE);
    if (nearWindow) {
      startVault(hunter, nearWindow, getHunterVaultDuration(HUNTER_WINDOW_VAULT_DURATION), now, "vaulting");
    }
  }

  function handlePlayerUse(now) {
    if (selectedRole === PLAYER_ROLE.hunter && isFighterArenaParticipant(hunter)) return;
    if (selectedRole === PLAYER_ROLE.survivor && isFighterArenaParticipant(player)) return;
    if (selectedRole === PLAYER_ROLE.hunter && isEdictor()) {
      useEdictHook(now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.survivor && (now < (player.edictStunnedUntil || 0) || now < (player.houndStunnedUntil || 0))) return;
    if (selectedRole === PLAYER_ROLE.hunter && isDancer()) {
      useDanceSpin(now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.hunter && isMirrorGhost()) {
      useMirrorLight(now);
      return;
    }
    if (selectedRole === PLAYER_ROLE.hunter && useGhostfire(now)) return;
    if (selectedRole === PLAYER_ROLE.hunter && isSoulBinder()) {
      borrowSoul(now);
      return;
    }
    if (!matchStarted || selectedRole !== PLAYER_ROLE.survivor) return;
    if (isShieldBearerGuarding(player, now)) {
      if (player.action && player.action.kind === "rescuing") {
        player.action = null;
        return;
      }
      const seatedTarget = findNearestSeatedTeammate(player, 96);
      if (seatedTarget) startRescue(player, seatedTarget, now);
      return;
    }
    if (isGeneralRiding(player, now)) {
      finishGeneralRide(player, now, "manual");
      return;
    }
    if (player.action && ["dismantlingLamp", "dismantlingPeeper", "dismantlingSoulPatrol"].includes(player.action.kind)) {
      player.action = null;
      return;
    }
    if (player.action && player.action.kind === "healing") {
      cancelHealing(player.action);
      player.action = null;
      return;
    }
    if (player.action && player.action.kind === "selfHealing") {
      player.action = null;
      return;
    }
    if (player.action && player.action.kind === "repairing") {
      if (resolvePlayerRepairCalibration(now)) return;
      cancelRepair(player.action);
      player.action = null;
      return;
    }
    if (player.action && player.action.kind === "openingGate") {
      cancelGateOpen(player.action);
      player.action = null;
      return;
    }
    if (player.action && player.action.kind === "rescuing") {
      player.action = null;
      return;
    }
    if (player.action && player.action.kind === "navigationChannelSlide") return;
    if (useNavigationChannelRide(player, now)) return;
    const hatchTarget = findNearestHatch(player, 96);
    if (hatchTarget && (player.state === "healthy" || player.state === "injured" || player.state === "downed")) {
      startHatchEscape(player, now);
      return;
    }

    if (player.state === "downed" && areExitsPowered()) {
      const gate = findNearestExitGate(player, GATE_USE_RANGE);
      if (gate && gate.opened) {
        startEscape(player, gate, now);
        return;
      }
    }

    if (player.state === "downed") {
      startSelfHealing(player, now);
      return;
    }

    if (player.state !== "healthy" && player.state !== "injured" || player.action || player.escaped) return;

    const peeperWard = findNearestPeeperWard(player, ASSIST_PEEPER_DISMANTLE_RANGE, now);
    if (peeperWard) {
      startDismantlePeeperWard(player, peeperWard, now);
      return;
    }

    const soulLamp = findNearestSoulLamp(player, SOUL_LAMP_DISMANTLE_RANGE);
    if (soulLamp) {
      startDismantleSoulLamp(player, soulLamp, now);
      return;
    }

    const soulPatrolPoint = findNearestSoulPatrolPoint(player, SOUL_PATROL_DISMANTLE_RANGE);
    if (soulPatrolPoint) {
      startDismantleSoulPatrol(player, soulPatrolPoint, now);
      return;
    }

    const seatedTarget = findNearestSeatedTeammate(player, 96);
    if (seatedTarget) {
      startRescue(player, seatedTarget, now);
      return;
    }

    const target = findNearestHealableTeammate(player, 92);
    if (target) {
      startHealing(player, target, now);
      return;
    }

    if (areExitsPowered()) {
      const gate = findNearestExitGate(player, GATE_USE_RANGE);
      if (gate) {
        if (gate.opened) startEscape(player, gate, now);
        else startOpenGate(player, gate, now);
        return;
      }
    }

    const repairPoint = findNearestRepairPoint(player, 110);
    if (repairPoint) startRepair(player, repairPoint, now);
  }

  function findNearestHealableTeammate(actor, range) {
    let nearest = null;
    let nearestDistance = Infinity;
    teammates.forEach((survivor) => {
      if (!canBeHealed(survivor)) return;
      const distance = distanceBetween(actor, survivor);
      if (distance < range && distance < nearestDistance) {
        nearest = survivor;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function findNearestStitchPackTarget(actor, range) {
    let nearest = null;
    let nearestDistance = Infinity;
    getSurvivors().forEach((survivor) => {
      if (survivor === actor || !canReceiveStitchPack(survivor)) return;
      const distance = distanceBetween(actor, survivor);
      if (distance < range && distance < nearestDistance) {
        nearest = survivor;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function canReceiveStitchPack(survivor) {
    return survivor &&
      survivor.state === "injured" &&
      !survivor.escaped &&
      !survivor.stitchPack &&
      (!survivor.action || survivor.action.kind !== "beingHealed");
  }

  function findNearestSeatedTeammate(actor, range) {
    let nearest = null;
    let nearestDistance = Infinity;
    getSurvivors().forEach((survivor) => {
      if (survivor === actor || survivor.state !== "seated" || !survivor.chair || isBeingRescued(survivor)) return;
      const distance = distanceBetween(actor, survivor.chair);
      if (distance < range && distance < nearestDistance) {
        nearest = survivor;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function findNearestRepairPoint(actor, range) {
    if (areExitsPowered()) return null;
    let nearest = null;
    let nearestDistance = Infinity;
    repairPoints.forEach((point) => {
      if (point.completed || isRepairingPoint(actor, point)) return;
      const distance = distanceBetween(actor, point);
      if (distance < range && distance < nearestDistance) {
        nearest = point;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function findNearestExitGate(actor, range) {
    let nearest = null;
    let nearestDistance = Infinity;
    exitGates.forEach((gate) => {
      const distance = distanceBetween(actor, gate);
      if (distance < range && distance < nearestDistance) {
        nearest = gate;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function isActorInGateUseRange(actor, gate, point = null) {
    if (!actor || !gate) return false;
    if (distanceBetween(actor, gate) <= GATE_USE_RANGE) return true;
    const gatePoint = point || (gate.opened ? getAIGateEscapePoint(actor, gate) : getAIGateInteractionPoint(actor, gate));
    return Boolean(gatePoint && distanceBetween(actor, gatePoint) <= GATE_POINT_USE_RANGE);
  }

  function findNearestHatch(actor, range) {
    if (!isHatchOpen()) return null;
    return distanceBetween(actor, hatch) < range ? hatch : null;
  }

  function isInPerfumeMist(actor, kind = null, now = performance.now()) {
    return perfumeMists.some((mist) => {
      if (now >= mist.until) return false;
      if (kind && mist.kind !== kind) return false;
      return distanceBetween(actor, mist) <= mist.radius;
    });
  }

  function getActivePerfumeMistForActor(actor, now = performance.now()) {
    return perfumeMists.find((mist) => now < mist.until && distanceBetween(actor, mist) <= mist.radius) || null;
  }

  function isHunterInPerfumeMist(now = performance.now()) {
    return isInPerfumeMist(hunter, null, now);
  }

  function canAIHunterSeeThroughPerfume(target, now = performance.now()) {
    if (selectedRole === PLAYER_ROLE.hunter) return true;
    if (!getActivePerfumeMistForActor(hunter, now)) return true;
    if (distanceBetween(hunter, target) <= PERFUME_AI_CLOSE_VISION_RANGE) return true;
    return false;
  }

  function isInPerfumeUltimateMist(actor, now = performance.now()) {
    return isInPerfumeMist(actor, "ultimate", now);
  }

  function isHunterDisplacementBlocked(now = performance.now()) {
    return isInPerfumeUltimateMist(hunter, now);
  }

  function findNearestSoulLamp(actor, range) {
    let nearest = null;
    let nearestDistance = Infinity;
    soulLamps.forEach((lamp) => {
      const distance = distanceBetween(actor, lamp);
      if (distance < range && distance < nearestDistance) {
        nearest = lamp;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function findNearestSoulPatrolPoint(actor, range) {
    let nearest = null;
    let nearestDistance = Infinity;
    getSoulPatrolPoints().forEach((point) => {
      const distance = distanceBetween(actor, point);
      if (distance < range && distance < nearestDistance) {
        nearest = point;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function findNearestNavigationChannel(actor, range) {
    let nearest = null;
    let nearestDistance = Infinity;
    navigationChannels.forEach((channel) => {
      const distance = distanceBetween(actor, channel);
      if (distance < range && distance < nearestDistance) {
        nearest = channel;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function dismantleNavigationChannel(channel, now) {
    const index = navigationChannels.indexOf(channel);
    if (index === -1) return false;
    navigationChannels.splice(index, 1);
    showAssistAlert("航道拆除", now, 850);
    return true;
  }

  function startDismantleNavigationChannel(channel, now) {
    if (!channel || hunter.action || !navigationChannels.includes(channel)) return false;
    hunter.status = "dismantlingChannel";
    hunter.action = {
      kind: "dismantlingChannel",
      start: now,
      until: now + NAVIGATION_CHANNEL_DISMANTLE_DURATION,
      channel
    };
    hunter.vx = 0;
    hunter.vy = 0;
    return true;
  }

  function findNearestPeeperWard(actor, range, now = performance.now()) {
    let nearest = null;
    let nearestDistance = Infinity;
    assistPeeperWards.forEach((ward) => {
      if (now >= ward.until) return;
      const distance = distanceBetween(actor, ward);
      if (distance < range && distance < nearestDistance) {
        nearest = ward;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function canRecallSoulLamp(now) {
    return matchStarted &&
      selectedRole === PLAYER_ROLE.hunter &&
      isLanternKeeper() &&
      !hunter.action &&
      !hunter.carrying &&
      now >= hunter.stunnedUntil &&
      now >= hunter.wipeUntil &&
      Boolean(findNearestSoulLamp(hunter, SOUL_LAMP_RECALL_RANGE));
  }

  function placeSoulLamp(now) {
    const safe = findNearestSafePosition(hunter.x, hunter.y, 8);
    soulLamps.push({
      id: ++soulLampId,
      x: safe.x,
      y: safe.y,
      createdAt: now,
      lastAlertAt: -Infinity,
      detectingUntil: 0
    });
    nextSoulLampAt = now + SOUL_LAMP_COOLDOWN;
    trackHunterSkillUseUnlock(now);
    lanternAlert = {
      text: `寄魂灯 ${soulLamps.length}/${getSoulLampLimit()}`,
      until: now + 1400
    };
    chasePulseUntil = now + 320;
  }

  function recallSoulLamp(lamp, now) {
    const index = soulLamps.indexOf(lamp);
    if (index === -1) return;
    soulLamps.splice(index, 1);
    if (lanternAlert && lanternAlert.lamp === lamp) lanternAlert = null;
    lanternAlert = {
      text: `收回寄魂灯 ${soulLamps.length}/${getSoulLampLimit()}`,
      until: now + 1400
    };
    chasePulseUntil = now + 320;
  }

  function getShadowTeleportTarget() {
    return findNearestSoulLamp(hunter, Infinity);
  }

  function shadowTeleportToSoulLamp(now) {
    const lamp = getShadowTeleportTarget();
    if (!lamp) return;
    const safe = findNearestSafePosition(lamp.x, lamp.y, hunter.radius);
    hunter.x = safe.x;
    hunter.y = safe.y;
    hunter.vx = 0;
    hunter.vy = 0;
    hunter.path = [];
    hunter.pathGoal = null;
    hunter.repathAt = 0;
    hunter.nextShadowTeleportAt = now + SOUL_LAMP_SHADOW_TELEPORT_COOLDOWN;
    hunter.status = "chasing";
    lanternAlert = {
      text: "灯影之人",
      until: now + 1400
    };
    chasePulseUntil = now + 420;
  }

  function screenToWorld(clientX, clientY) {
    const box = canvas.getBoundingClientRect();
    const localX = actorClamp(clientX - box.left, 0, box.width || width);
    const localY = actorClamp(clientY - box.top, 0, box.height || height);
    return {
      x: camera.x + localX / camera.zoom,
      y: camera.y + localY / camera.zoom
    };
  }

  function rememberAimPointer(clientX, clientY) {
    lastAimPointer = { clientX, clientY };
  }

  function getAimTargetFromPointer(clientX, clientY, useLastPointer = true) {
    if (typeof clientX === "number" && typeof clientY === "number") {
      rememberAimPointer(clientX, clientY);
      return screenToWorld(clientX, clientY);
    }
    if (useLastPointer && lastAimPointer) return screenToWorld(lastAimPointer.clientX, lastAimPointer.clientY);
    return null;
  }

  function getBlinkDestination() {
    const target = getAimTargetFromPointer(null, null, true) || {
      x: hunter.x + Math.cos(hunter.angle) * ASSIST_BLINK_DISTANCE,
      y: hunter.y + Math.sin(hunter.angle) * ASSIST_BLINK_DISTANCE
    };
    const dx = target.x - hunter.x;
    const dy = target.y - hunter.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 1) return { x: hunter.x, y: hunter.y };
    const scale = Math.min(ASSIST_BLINK_DISTANCE, distance) / distance;
    const destination = {
      x: hunter.x + dx * scale,
      y: hunter.y + dy * scale
    };
    return getBlinkReachableDestination(destination);
  }

  function getBlinkReachableDestination(destination) {
    const dx = destination.x - hunter.x;
    const dy = destination.y - hunter.y;
    const distance = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.ceil(distance / 12));
    let lastReachable = { x: hunter.x, y: hunter.y };

    for (let step = 1; step <= steps; step += 1) {
      const t = step / steps;
      const x = hunter.x + dx * t;
      const y = hunter.y + dy * t;
      const blockedByThickWall = getCollisionRects().some((obstacle) => {
        return !isBlinkPhaseableObstacle(obstacle) && circleHitsRect(x, y, hunter.radius, obstacle);
      });
      if (blockedByThickWall) break;
      lastReachable = { x, y };
    }

    return findNearestSafePosition(lastReachable.x, lastReachable.y, hunter.radius);
  }

  function isBlinkPhaseableObstacle(obstacle) {
    return Boolean(obstacle && (obstacle.blinkPhaseable || Math.min(obstacle.w, obstacle.h) <= ASSIST_BLINK_PHASE_WALL_THICKNESS));
  }

  function moveHunterByBlink(destination) {
    const safeDestination = findNearestSafePosition(destination.x, destination.y, hunter.radius);
    const beforeX = hunter.x;
    const beforeY = hunter.y;
    hunter.x = safeDestination.x;
    hunter.y = safeDestination.y;
    hunter.path = [];
    hunter.pathGoal = null;
    return Math.hypot(hunter.x - beforeX, hunter.y - beforeY);
  }

  function getDefaultPackageTarget(actor) {
    return {
      x: actor.x + Math.cos(actor.angle) * PACKAGE_RANGE,
      y: actor.y + Math.sin(actor.angle) * PACKAGE_RANGE
    };
  }

  function startPackageAim(actor, now, clientX = null, clientY = null, pointerId = null, useLastPointer = true) {
    if (packageAim || !canThrowPackage(actor, now)) return false;
    const target = getAimTargetFromPointer(clientX, clientY, useLastPointer) || getDefaultPackageTarget(actor);
    packageAim = {
      actor,
      targetX: target.x,
      targetY: target.y,
      pointerId
    };
    return true;
  }

  function updatePackageAim(clientX, clientY, pointerId = null) {
    if (packageAim && packageAim.pointerId !== null && pointerId !== null && packageAim.pointerId !== pointerId) return;
    if (typeof clientX === "number" && typeof clientY === "number") rememberAimPointer(clientX, clientY);
    if (!packageAim) return;
    const target = getAimTargetFromPointer(clientX, clientY);
    if (!target) return;
    packageAim.targetX = target.x;
    packageAim.targetY = target.y;
  }

  function finishPackageAim(now, pointerId = null) {
    if (!packageAim) return false;
    if (packageAim.pointerId !== null && pointerId !== null && packageAim.pointerId !== pointerId) return false;
    const aim = packageAim;
    packageAim = null;
    if (!canThrowPackage(aim.actor, now)) return false;
    const dx = aim.targetX - aim.actor.x;
    const dy = aim.targetY - aim.actor.y;
    const distance = Math.hypot(dx, dy);
    const angle = distance > 8 ? Math.atan2(dy, dx) : aim.actor.angle;
    const range = Math.min(PACKAGE_RANGE, Math.max(80, distance || PACKAGE_RANGE));
    throwPackage(aim.actor, angle, now, range);
    return true;
  }

  function cancelPackageAim(pointerId = null) {
    if (!packageAim) return;
    if (packageAim.pointerId !== null && pointerId !== null && packageAim.pointerId !== pointerId) return;
    packageAim = null;
  }

  function getNavigationChannelCooldownLeft(actor, now = performance.now()) {
    return Math.max(0, (actor && actor.nextNavigationChannelAt || 0) - now);
  }

  function getNavigationChannelRideCooldownLeft(actor, now = performance.now()) {
    return Math.max(0, (actor && actor.nextNavigationChannelRideAt || 0) - now);
  }

  function getNavigatorOwnNavigationChannel(actor) {
    return navigationChannels.find((channel) => {
      return channel.owner === actor && distanceBetween(actor, channel) <= NAVIGATION_CHANNEL_RADIUS + actor.radius;
    }) || null;
  }

  function getNavigationChannelForActor(actor) {
    return navigationChannels.find((channel) => {
      return distanceBetween(actor, channel) <= NAVIGATION_CHANNEL_RADIUS + actor.radius;
    }) || null;
  }

  function canUseNavigationChannelRide(actor, now = performance.now()) {
    const channel = getNavigationChannelForActor(actor);
    if (!channel) return false;
    const isOwner = channel.owner === actor;
    return matchStarted &&
      !actor.action &&
      !actor.escaped &&
      (actor.state === "healthy" || actor.state === "injured") &&
      (!isOwner || isNavigator(actor) && getNavigationChannelRideCooldownLeft(actor, now) <= 0);
  }

  function useNavigationChannelRide(actor, now = performance.now()) {
    if (!canUseNavigationChannelRide(actor, now)) return false;
    const channel = getNavigationChannelForActor(actor);
    if (!channel || !startNavigationChannelSlide(actor, channel, now)) return false;
    if (channel.owner === actor) actor.nextNavigationChannelRideAt = now + NAVIGATION_CHANNEL_RIDE_COOLDOWN;
    showAssistAlert(channel.owner === actor ? "引航借道" : "驶入航道", now, 800);
    return true;
  }

  function canStartNavigationChannelAim(actor, now = performance.now()) {
    return matchStarted &&
      isNavigator(actor) &&
      !actor.action &&
      !actor.escaped &&
      (actor.state === "healthy" || actor.state === "injured") &&
      getNavigationChannelCooldownLeft(actor, now) <= 0;
  }

  function getNavigationChannelAimPoint(actor, clientX = null, clientY = null, useLastPointer = true) {
    const target = getAimTargetFromPointer(clientX, clientY, useLastPointer) || {
      x: actor.x + Math.cos(actor.angle) * NAVIGATION_CHANNEL_AIM_RANGE,
      y: actor.y + Math.sin(actor.angle) * NAVIGATION_CHANNEL_AIM_RANGE
    };
    const dx = target.x - actor.x;
    const dy = target.y - actor.y;
    const distance = Math.hypot(dx, dy);
    const range = Math.min(NAVIGATION_CHANNEL_AIM_RANGE, Math.max(24, distance || NAVIGATION_CHANNEL_AIM_RANGE));
    return findNearestSafePosition(actor.x + (dx / Math.max(distance, 0.001)) * range, actor.y + (dy / Math.max(distance, 0.001)) * range, 8);
  }

  function startNavigationChannelAim(actor, now, clientX = null, clientY = null, pointerId = null, useLastPointer = true) {
    if (navigationChannelAim) {
      if (navigationChannelAim.actor !== actor || navigationChannelAim.phase !== "direction") return false;
      navigationChannelAim.pointerId = pointerId;
      updateNavigationChannelAim(clientX, clientY, pointerId);
      return true;
    }
    if (!canStartNavigationChannelAim(actor, now)) return false;
    const point = getNavigationChannelAimPoint(actor, clientX, clientY, useLastPointer);
    navigationChannelAim = {
      actor,
      phase: "placement",
      x: point.x,
      y: point.y,
      angle: actor.angle || 0,
      pointerId
    };
    showAssistAlert("航道：拖拽选起点", now, 900);
    return true;
  }

  function updateNavigationChannelAim(clientX, clientY, pointerId = null) {
    if (!navigationChannelAim) return false;
    if (navigationChannelAim.pointerId !== null && pointerId !== null && navigationChannelAim.pointerId !== pointerId) return false;
    const aim = navigationChannelAim;
    if (aim.phase === "placement") {
      const point = getNavigationChannelAimPoint(aim.actor, clientX, clientY);
      aim.x = point.x;
      aim.y = point.y;
      return true;
    }
    const target = getAimTargetFromPointer(clientX, clientY);
    if (!target) return false;
    const dx = target.x - aim.x;
    const dy = target.y - aim.y;
    if (Math.hypot(dx, dy) > 8) aim.angle = Math.atan2(dy, dx);
    return true;
  }

  function finishNavigationChannelAim(now, pointerId = null) {
    if (!navigationChannelAim) return false;
    if (navigationChannelAim.pointerId !== null && pointerId !== null && navigationChannelAim.pointerId !== pointerId) return false;
    const aim = navigationChannelAim;
    if (aim.phase === "placement") {
      aim.phase = "direction";
      aim.pointerId = null;
      showAssistAlert("航道：再次按 Q 选方向", now, 1100);
      return true;
    }
    navigationChannelAim = null;
    if (!canStartNavigationChannelAim(aim.actor, now)) return false;
    placeNavigationChannel(aim.actor, aim.x, aim.y, aim.angle, now);
    return true;
  }

  function cancelNavigationChannelAim(actor = null) {
    if (!navigationChannelAim || actor && navigationChannelAim.actor !== actor) return;
    navigationChannelAim = null;
  }

  function getNavigationChannelRecipient() {
    if (!canAISurvivorSeeHunter()) return null;
    const target = hunter.target;
    if (!getSurvivors().includes(target)) return null;
    if (target.escaped || target.state !== "healthy" && target.state !== "injured") return null;
    return target;
  }

  function getNavigationChannelSlidePreview(x, y, angle, radius) {
    const steps = Math.max(1, Math.ceil(NAVIGATION_CHANNEL_SLIDE_DISTANCE / MOVE_COLLISION_STEP));
    const stepDistance = NAVIGATION_CHANNEL_SLIDE_DISTANCE / steps;
    let previewX = x;
    let previewY = y;
    let distance = 0;
    for (let step = 0; step < steps; step += 1) {
      const nextX = actorClamp(previewX + Math.cos(angle) * stepDistance, radius, world.width - radius);
      const nextY = actorClamp(previewY + Math.sin(angle) * stepDistance, radius, world.height - radius);
      if (collides(nextX, nextY, radius)) break;
      distance += Math.hypot(nextX - previewX, nextY - previewY);
      previewX = nextX;
      previewY = nextY;
    }
    return { x: previewX, y: previewY, distance, safe: distance >= NAVIGATION_CHANNEL_SLIDE_DISTANCE - 1 };
  }

  function placeNavigationChannel(owner, x, y, angle, now) {
    navigationChannels.length = 0;
    getSurvivors().forEach((survivor) => {
      survivor.navigationChannelDirective = null;
    });
    const recipient = getNavigationChannelRecipient();
    const channel = {
      id: ++navigationChannelId,
      owner,
      x,
      y,
      angle,
      createdAt: now,
      recipient,
      preview: getNavigationChannelSlidePreview(x, y, angle, recipient ? recipient.radius : owner.radius)
    };
    navigationChannels.push(channel);
    if (recipient && recipient.kind === "ai") {
      recipient.navigationChannelDirective = { channelId: channel.id, until: now + 4200 };
    }
    owner.nextNavigationChannelAt = now + NAVIGATION_CHANNEL_COOLDOWN;
    showAssistAlert("航道展开", now, 900);
  }

  function startNavigationChannelSlide(actor, channel, now) {
    if (!actor || actor.action || actor.escaped || actor.state !== "healthy" && actor.state !== "injured") return false;
    actor.action = {
      kind: "navigationChannelSlide",
      start: now,
      until: now + NAVIGATION_CHANNEL_SLIDE_DURATION,
      lastUpdate: now,
      angle: channel.angle,
      distance: 0
    };
    actor.path = [];
    actor.pathGoal = null;
    showAssistAlert("驶入航道", now, 700);
    return true;
  }

  function moveActorAlongNavigationChannel(actor, distance, angle) {
    const steps = Math.max(1, Math.ceil(distance / MOVE_COLLISION_STEP));
    const stepDistance = distance / steps;
    let moved = 0;
    for (let step = 0; step < steps; step += 1) {
      const x = actorClamp(actor.x + Math.cos(angle) * stepDistance, actor.radius, world.width - actor.radius);
      const y = actorClamp(actor.y + Math.sin(angle) * stepDistance, actor.radius, world.height - actor.radius);
      if (actorCollides(actor, x, y, actor.radius)) break;
      moved += Math.hypot(x - actor.x, y - actor.y);
      actor.x = x;
      actor.y = y;
    }
    return moved;
  }

  function updateNavigationChannelSlideAction(actor, action, now) {
    if (actor.state !== "healthy" && actor.state !== "injured") {
      actor.action = null;
      return true;
    }
    const elapsed = Math.max(0, now - action.lastUpdate);
    action.lastUpdate = now;
    const remaining = Math.max(0, NAVIGATION_CHANNEL_SLIDE_DISTANCE - action.distance);
    const intended = Math.min(remaining, NAVIGATION_CHANNEL_SLIDE_DISTANCE * elapsed / NAVIGATION_CHANNEL_SLIDE_DURATION);
    const moved = intended > 0 ? moveActorAlongNavigationChannel(actor, intended, action.angle) : 0;
    action.distance += moved;
    actor.vx = Math.cos(action.angle) * moved / Math.max(elapsed / 1000, 0.001);
    actor.vy = Math.sin(action.angle) * moved / Math.max(elapsed / 1000, 0.001);
    if (moved + 0.5 < intended || action.distance >= NAVIGATION_CHANNEL_SLIDE_DISTANCE || now >= action.until) {
      actor.action = null;
      actor.vx = 0;
      actor.vy = 0;
    }
    return true;
  }

  function getDefaultActorRescuePhantomTarget(actor) {
    return {
      x: actor.x + Math.cos(actor.angle) * ACTOR_RESCUE_PHANTOM_RANGE,
      y: actor.y + Math.sin(actor.angle) * ACTOR_RESCUE_PHANTOM_RANGE
    };
  }

  function startActorRescuePhantomAim(actor, now, clientX = null, clientY = null, pointerId = null, useLastPointer = true) {
    if (actorRescuePhantomAim || !canUseActorRescuePhantom(actor, now)) return false;
    const target = getAimTargetFromPointer(clientX, clientY, useLastPointer) || getDefaultActorRescuePhantomTarget(actor);
    actorRescuePhantomAim = { actor, targetX: target.x, targetY: target.y, pointerId };
    return true;
  }

  function updateActorRescuePhantomAim(clientX, clientY, pointerId = null) {
    if (actorRescuePhantomAim && actorRescuePhantomAim.pointerId !== null && pointerId !== null && actorRescuePhantomAim.pointerId !== pointerId) return;
    if (typeof clientX === "number" && typeof clientY === "number") rememberAimPointer(clientX, clientY);
    if (!actorRescuePhantomAim) return;
    const target = getAimTargetFromPointer(clientX, clientY);
    if (!target) return;
    actorRescuePhantomAim.targetX = target.x;
    actorRescuePhantomAim.targetY = target.y;
  }

  function finishActorRescuePhantomAim(now, pointerId = null) {
    if (!actorRescuePhantomAim) return false;
    if (actorRescuePhantomAim.pointerId !== null && pointerId !== null && actorRescuePhantomAim.pointerId !== pointerId) return false;
    const aim = actorRescuePhantomAim;
    actorRescuePhantomAim = null;
    return useActorRescuePhantom(aim.actor, now, aim.targetX, aim.targetY);
  }

  function cancelActorRescuePhantomAim(pointerId = null) {
    if (!actorRescuePhantomAim) return;
    if (actorRescuePhantomAim.pointerId !== null && pointerId !== null && actorRescuePhantomAim.pointerId !== pointerId) return;
    actorRescuePhantomAim = null;
  }

  function placeTimeDevice(actor, now) {
    if (!canPlaceTimeDevice(actor, now)) return;
    actor.timeDevice = {
      x: actor.x,
      y: actor.y,
      state: actor.state,
      damageProgress: actor.damageProgress || 0,
      healProgress: actor.healProgress || 0,
      until: now + TIME_REWIND_WINDOW
    };
    actor.nextTimeRewindAt = now + TIME_REWIND_COOLDOWN;
    chasePulseUntil = now + 360;
  }

  function activateTimeRewind(actor, now) {
    if (!canActivateTimeRewind(actor, now)) return;
    const device = actor.timeDevice;
    cancelSurvivorAction(actor);
    const safe = findNearestSafePosition(device.x, device.y, actor.radius);
    actor.x = safe.x;
    actor.y = safe.y;
    actor.vx = 0;
    actor.vy = 0;
    actor.state = device.state;
    actor.damageProgress = device.damageProgress || 0;
    actor.healProgress = device.healProgress || 0;
    actor.downedAt = null;
    actor.chair = null;
    actor.carryProgress = 0;
    actor.boostUntil = Math.max(actor.boostUntil || 0, now + TIME_REWIND_BOOST_DURATION);
    actor.invisibleUntil = now + TIME_REWIND_STEALTH_DURATION;
    actor.timeDevice = null;
    actor.path = [];
    actor.pathGoal = null;
    actor.healDecision = null;
    actor.objectiveDecision = null;
    if (hunter.target === actor) hunter.target = null;
    chasePulseUntil = now + 520;
  }

  function toggleMagicShowMode(actor) {
    if (!isActor(actor)) return;
    actor.magicShowMode = actor.magicShowMode === "rescue" ? "hunter" : "rescue";
    lanternAlert = {
      text: actor.magicShowMode === "rescue" ? "魔术秀：转移椅上队友" : "魔术秀：转移监管者",
      until: performance.now() + 1200
    };
  }

  function performMagicShow(actor, now) {
    if (!canUseMagicShow(actor, now)) return false;
    const success = actor.magicShowMode === "hunter"
      ? magicShowMoveHunter(actor, now)
      : magicShowMoveSeatedSurvivor(actor, now);
    if (!success) {
      lanternAlert = {
        text: actor.magicShowMode === "hunter" ? "附近没有空椅子" : "没有可转移的上椅队友",
        until: now + 1400
      };
      return false;
    }
    actor.nextMagicShowAt = now + MAGIC_SHOW_COOLDOWN;
    chasePulseUntil = now + 520;
    return true;
  }

  function getActorRescuePhantomPlacement(actor, targetX, targetY) {
    const dx = targetX - actor.x;
    const dy = targetY - actor.y;
    const distance = Math.hypot(dx, dy);
    const angle = distance > 8 ? Math.atan2(dy, dx) : actor.angle;
    const range = Math.min(ACTOR_RESCUE_PHANTOM_RANGE, distance || ACTOR_RESCUE_PHANTOM_RANGE);
    return {
      angle,
      point: findNearestSafePosition(actor.x + Math.cos(angle) * range, actor.y + Math.sin(angle) * range, actor.radius)
    };
  }

  function getActorRescuePhantomGuardPoint(target) {
    const direction = normalizeVector(hunter.x - target.x, hunter.y - target.y);
    const fallback = normalizeVector(hunter.x - player.x, hunter.y - player.y);
    const guardDirection = direction.x || direction.y ? direction : fallback;
    return {
      x: target.x + guardDirection.x * ACTOR_RESCUE_PHANTOM_GUARD_DISTANCE,
      y: target.y + guardDirection.y * ACTOR_RESCUE_PHANTOM_GUARD_DISTANCE
    };
  }

  function useActorRescuePhantom(actor, now, targetX = actor.x, targetY = actor.y, guardTarget = null) {
    if (!canUseActorRescuePhantom(actor, now)) return false;
    const placement = getActorRescuePhantomPlacement(actor, targetX, targetY);
    actorDecoys.push(createSmartDecoy(actor, placement.point.x, placement.point.y, placement.angle, {
      kind: "actorRescuePhantom",
      name: "救援幻影",
      state: "healthy",
      speed: ACTOR_RESCUE_PHANTOM_SPEED,
      until: now + ACTOR_RESCUE_PHANTOM_DURATION,
      duration: ACTOR_RESCUE_PHANTOM_DURATION,
      rescuePhantom: true,
      guardTarget
    }));
    actor.nextRescuePhantomAt = now + ACTOR_RESCUE_PHANTOM_COOLDOWN;
    showAssistAlert("救援幻影", now, 1000);
    return true;
  }

  function usePerfumeSkill(actor, now) {
    if (!canUsePerfumeMist(actor, now)) return false;
    if (hasPerfumeUltimate(actor)) {
      releasePerfumeUltimate(actor, now);
      return true;
    }
    releasePerfumeMist(actor, now);
    return true;
  }

  function releasePerfumeMist(actor, now) {
    perfumeMists.push({
      id: ++perfumeMistId,
      kind: "mist",
      owner: actor,
      x: actor.x,
      y: actor.y,
      radius: PERFUME_MIST_RADIUS,
      until: now + PERFUME_MIST_DURATION
    });
    actor.perfumeBoostUntil = now + PERFUME_MIST_DURATION;
    actor.perfumeUltimateCharges = Math.min(PERFUME_ULTIMATE_CHARGES, (actor.perfumeUltimateCharges || 0) + 1);
    actor.nextPerfumeMistAt = now + PERFUME_MIST_COOLDOWN;
    showAssistAlert(actor.perfumeUltimateCharges >= PERFUME_ULTIMATE_CHARGES ? "终极香炉已点燃" : "迷香", now, 1100);
  }

  function releasePerfumeUltimate(actor, now) {
    const mist = {
      id: ++perfumeMistId,
      kind: "ultimate",
      owner: actor,
      x: actor.x,
      y: actor.y,
      radius: PERFUME_ULTIMATE_RADIUS,
      until: now + PERFUME_ULTIMATE_DURATION
    };
    perfumeMists.push(mist);
    actor.perfumeUltimateCharges = 0;
    actor.nextPerfumeMistAt = now + PERFUME_MIST_COOLDOWN;
    spawnPerfumeIllusions(actor, mist, now);
    showAssistAlert("幻香大阵", now, 1200);
  }

  function spawnPerfumeIllusions(actor, mist, now) {
    for (let index = 0; index < PERFUME_ULTIMATE_ILLUSIONS; index += 1) {
      const angle = -Math.PI / 2 + index * (Math.PI * 2 / PERFUME_ULTIMATE_ILLUSIONS);
      const distance = mist.radius * 0.55;
      actorDecoys.push(createSmartDecoy(actor, mist.x + Math.cos(angle) * distance, mist.y + Math.sin(angle) * distance, angle, {
        state: "healthy",
        speed: actor.speed * 0.94,
        until: now + PERFUME_ULTIMATE_DURATION
      }));
    }
  }

  function magicShowMoveSeatedSurvivor(actor, now) {
    const target = findNearestSeatedSurvivor(actor, Infinity);
    if (!target || !target.chair) return false;
    if (isBeingRescued(target)) return false;
    const targetChair = findNearestEmptyChair(actor, Infinity);
    if (!targetChair) return false;

    const oldChair = target.chair;
    const progress = target.chairProgress || 0;
    oldChair.survivor = null;
    targetChair.survivor = target;
    target.chair = targetChair;
    target.x = targetChair.x;
    target.y = targetChair.y;
    target.vx = 0;
    target.vy = 0;
    target.chairProgress = progress;
    target.chairStart = now - progress * CHAIR_ELIMINATION_DURATION;
    target.path = [];
    target.pathGoal = null;
    lanternAlert = { text: `魔术秀转移 ${target.name}`, until: now + 1500 };
    return true;
  }

  function magicShowMoveHunter(actor, now) {
    const targetChair = findNearestEmptyChair(actor, Infinity);
    if (!targetChair) return false;
    const safe = findNearestSafePosition(targetChair.x + 58, targetChair.y + 18, hunter.radius);
    hunter.x = safe.x;
    hunter.y = safe.y;
    hunter.vx = 0;
    hunter.vy = 0;
    hunter.action = null;
    hunter.path = [];
    hunter.pathGoal = null;
    hunter.target = null;
    hunter.status = "chasing";
    if (hunter.carrying) updateCarriedSurvivorPosition();
    lanternAlert = { text: "魔术秀转移监管者", until: now + 1500 };
    return true;
  }

  function findNearestSeatedSurvivor(actor, range) {
    let nearest = null;
    let nearestDistance = Infinity;
    getSurvivors().forEach((survivor) => {
      if (survivor === actor || survivor.state !== "seated" || !survivor.chair) return;
      const distance = distanceBetween(actor, survivor.chair);
      if (distance < range && distance < nearestDistance) {
        nearest = survivor;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function cancelRescuesForTarget(target) {
    getSurvivors().forEach((survivor) => {
      if (survivor.action && survivor.action.kind === "rescuing" && survivor.action.target === target) {
        survivor.action = null;
      }
    });
  }

  function throwPackage(actor, angle, now, range = PACKAGE_RANGE) {
    actor.nextPackageAt = now + PACKAGE_COOLDOWN;
    packageProjectiles.push({
      id: ++packageProjectileId,
      owner: actor,
      x: actor.x + Math.cos(angle) * (actor.radius + 12),
      y: actor.y + Math.sin(angle) * (actor.radius + 12),
      vx: Math.cos(angle) * PACKAGE_SPEED,
      vy: Math.sin(angle) * PACKAGE_SPEED,
      angle,
      range,
      traveled: 0,
      createdAt: now
    });
    actor.action = {
      kind: "packageRecoil",
      start: now,
      until: now + PACKAGE_RECOIL_DURATION,
      lastUpdate: now,
      faceAngle: angle,
      moveAngle: angle + Math.PI,
      distance: 0
    };
    chasePulseUntil = now + 240;
  }

  function updatePackageProjectiles(dt, now) {
    for (let index = packageProjectiles.length - 1; index >= 0; index -= 1) {
      const item = packageProjectiles[index];
      const dx = item.vx * dt;
      const dy = item.vy * dt;
      item.x += dx;
      item.y += dy;
      item.traveled += Math.hypot(dx, dy);

      if (packageHitsHunter(item, now)) {
        packageProjectiles.splice(index, 1);
        continue;
      }

      if (item.traveled >= item.range || collides(item.x, item.y, PACKAGE_RADIUS)) {
        packageProjectiles.splice(index, 1);
      }
    }
  }

  function updateGhostfireProjectiles(dt, now) {
    for (let index = ghostfireProjectiles.length - 1; index >= 0; index -= 1) {
      const item = ghostfireProjectiles[index];
      const dx = item.vx * dt;
      const dy = item.vy * dt;
      item.x += dx;
      item.y += dy;
      item.traveled += Math.hypot(dx, dy);

      const hitTarget = getSurvivors().find((survivor) => {
        if (survivor.escaped || survivor.state === "seated" || survivor.state === "carried" || survivor.state === "eliminated") return false;
        return distanceBetween(item, survivor) <= survivor.radius + GHOSTFIRE_RADIUS;
      });
      if (hitTarget) {
        applyHunterHit(hitTarget, now, {
          allowTerrorShock: false,
          applyBoneBleed: false,
          damage: GHOSTFIRE_DAMAGE
        });
        ghostfireProjectiles.splice(index, 1);
        continue;
      }

      if (item.traveled >= GHOSTFIRE_RANGE) ghostfireProjectiles.splice(index, 1);
    }
  }

  function updateEdictSystems(dt, now) {
    getSurvivors().forEach((survivor) => {
      if (now >= (survivor.edictViolationUntil || 0)) survivor.edictViolationStacks = 0;
    });

    for (let index = edictTraps.length - 1; index >= 0; index -= 1) {
      const trap = edictTraps[index];
      const target = getSurvivors().find((survivor) => {
        if (survivor.escaped || survivor.state !== "healthy" && survivor.state !== "injured") return false;
        return distanceBetween(survivor, trap) <= survivor.radius + EDICTOR_TRAP_RADIUS;
      });
      if (!target) continue;
      const blocked = tryBlockShieldBearerNegativeStatus(target, now, "封界");
      if (!blocked) {
        cancelSurvivorAction(target);
        target.edictStunnedUntil = Math.max(target.edictStunnedUntil || 0, now + EDICTOR_TRAP_STUN_DURATION);
        addEdictViolation(target, now);
      }
      edictTraps.splice(index, 1);
      showAssistAlert(`${target.name}触发封界`, now, 900);
    }

    for (let index = edictHooks.length - 1; index >= 0; index -= 1) {
      const hook = edictHooks[index];
      const dx = hook.vx * dt;
      const dy = hook.vy * dt;
      hook.x += dx;
      hook.y += dy;
      hook.traveled += Math.hypot(dx, dy);
      const targets = actorDecoys.filter((decoy) => decoy.kind === "actorRescuePhantom").concat(getSurvivors());
      const target = targets.find((survivor) => {
        if (survivor.escaped || survivor.state !== "healthy" && survivor.state !== "injured") return false;
        return distanceBetween(survivor, hook) <= survivor.radius + EDICTOR_HOOK_RADIUS;
      });
      if (target) {
        if (isActorDecoyTarget(target)) {
          breakActorDecoy(target, now);
          showAssistAlert("幻影断勾", now, 900);
        } else {
          resolveEdictHookHit(target, now);
        }
        edictHooks.splice(index, 1);
        continue;
      }
      if (collides(hook.x, hook.y, EDICTOR_HOOK_RADIUS)) {
        if (hunter.presenceTier >= 2) {
          const safe = findNearestSafePosition(hook.x - dx, hook.y - dy, hunter.radius);
          hunter.x = safe.x;
          hunter.y = safe.y;
          hunter.vx = 0;
          hunter.vy = 0;
          hunter.path = [];
          hunter.pathGoal = null;
          hunter.nextEdictHookAt = Math.max(now, (hunter.nextEdictHookAt || now) - EDICTOR_TIER_TWO_WALL_REFUND);
          showAssistAlert("越界执行 · 裁定返还 8 秒", now, 900);
        }
        edictHooks.splice(index, 1);
        continue;
      }
      if (hook.traveled >= EDICTOR_HOOK_RANGE) edictHooks.splice(index, 1);
    }
  }

  function resolveEdictHookHit(target, now) {
    const stacks = getEdictViolationStacks(target);
    if (hunter.presenceTier >= 1) {
      applyHunterHit(target, now, { allowTerrorShock: false, applyBoneBleed: false, damage: 0.5 });
    }
    const blocked = tryBlockShieldBearerNegativeStatus(target, now, "裁定控制");
    if (!blocked && (target.state === "healthy" || target.state === "injured")) {
      cancelSurvivorAction(target);
      target.edictStunnedUntil = Math.max(target.edictStunnedUntil || 0, now + EDICTOR_HOOK_STUN_DURATION);
    }
    applyEdictHookEffect(target, stacks, now, blocked);
    showAssistAlert(stacks >= 1 ? "裁定拉回" : "裁定 · 翻越减速", now, 900);
  }

  function applyEdictHookEffect(survivor, stacks, now, negativeStatusBlocked = false) {
    if (stacks === 0) {
      if (!negativeStatusBlocked) survivor.edictHookSlowUntil = now + EDICTOR_HOOK_SLOW_DURATION;
      return;
    }
    if (survivor.state === "downed") return;
    const angle = Math.atan2(survivor.y - hunter.y, survivor.x - hunter.x);
    const safe = findNearestSafePosition(
      hunter.x + Math.cos(angle) * (hunter.radius + survivor.radius + EDICTOR_HOOK_PULL_DISTANCE),
      hunter.y + Math.sin(angle) * (hunter.radius + survivor.radius + EDICTOR_HOOK_PULL_DISTANCE),
      survivor.radius
    );
    cancelSurvivorAction(survivor);
    survivor.x = safe.x;
    survivor.y = safe.y;
    survivor.vx = 0;
    survivor.vy = 0;
    survivor.path = [];
    survivor.pathGoal = null;
  }

  function updateTunerEchoLines(now) {
    for (let index = tunerEchoLines.length - 1; index >= 0; index -= 1) {
      const line = tunerEchoLines[index];
      if (now >= line.until) {
        tunerEchoLines.splice(index, 1);
        continue;
      }
      if (!circleHitsSegment(hunter.x, hunter.y, hunter.radius + TUNER_ECHO_THICKNESS * 0.5, line)) continue;
      hunter.tunerEchoSlowUntil = Math.max(hunter.tunerEchoSlowUntil || 0, now + TUNER_ECHO_SLOW_DURATION);
      tunerEchoLines.splice(index, 1);
      showAssistAlert("回声减速", now, 700);
    }
  }

  function packageHitsHunter(item, now) {
    if (distanceBetween(item, hunter) > hunter.radius + PACKAGE_HIT_RADIUS) return false;
    applyPackageHit(item, now);
    return true;
  }

  function applyPackageHit(item, now) {
    const owner = item && item.owner;
    const rescuedTarget = interruptHunterByStun(now, PACKAGE_STUN_DURATION);
    applyMessengerCarryRescueShield(owner, rescuedTarget, now);
    if (owner && isMessenger(owner) && !owner.escaped && owner.state !== "eliminated") {
      owner.boostUntil = Math.max(owner.boostUntil || 0, now + PACKAGE_HIT_BOOST_DURATION);
      if (hunter.target === owner) {
        owner.nextPackageAt = Math.max(now, (owner.nextPackageAt || now) - PACKAGE_CHASE_HIT_COOLDOWN_REFUND);
      }
    }
    chasePulseUntil = now + 420;
  }

  function applyMessengerCarryRescueShield(owner, target, now) {
    if (!isMessenger(owner) || owner.escaped || owner.state === "eliminated" || !target) return;
    if (target.escaped || target.state === "eliminated") return;
    target.medicShieldUntil = Math.max(target.medicShieldUntil || 0, now + MESSENGER_CARRY_RESCUE_SHIELD_DURATION);
    target.medicShieldHits = Math.max(target.medicShieldHits || 0, 1);
    if (target.medicShieldSource !== "medic") target.medicShieldSource = "messenger";
    if (owner.kind === "ai") {
      owner.messengerSupport = {
        target,
        mode: "escort",
        value: getAIMessengerSupportValue(target) + 2,
        until: now + AI_MESSENGER_ESCORT_DURATION
      };
    }
    showAssistAlert("信使护盾", now, 1000);
  }

  function updateTwinSwordSystems(dt, now) {
    if (!isTwinSword()) {
      twinAim = null;
      return;
    }
    if (now >= (hunter.twinEnlightenedUntil || 0)) {
      if (hunter.twinWasEnlightened) {
        hunter.twinIntent = TWIN_INTENT_INITIAL;
        hunter.twinWasEnlightened = false;
      } else {
        hunter.twinIntent = Math.min(TWIN_INTENT_MAX, (hunter.twinIntent || TWIN_INTENT_INITIAL) + TWIN_INTENT_REGEN * dt);
      }
      if ((hunter.twinIntent || 0) >= TWIN_INTENT_MAX) enterTwinEnlightenment(now);
    }
    if (hunter.twinTimePower && now >= hunter.twinTimePower.until) hunter.twinTimePower = null;
    updateTwinSwordProjectiles(dt, now);
    updateTwinShadowZones(dt, now);
    updateTwinGaze(dt, now);
    updateTwinShackleDecay(dt, now);
  }

  function enterTwinEnlightenment(now) {
    const duration = hunter.presenceTier >= 1 ? TWIN_ENLIGHTENMENT_TIER_ONE_DURATION : TWIN_ENLIGHTENMENT_DURATION;
    hunter.twinIntent = TWIN_INTENT_MAX;
    hunter.twinEnlightenedUntil = now + duration;
    hunter.twinEnlightenmentCount = (hunter.twinEnlightenmentCount || 0) + 1;
    hunter.twinWasEnlightened = true;
    lanternAlert = {
      text: "万剑归宗",
      until: now + 1800
    };
  }

  function canTwinAffectSurvivor(survivor) {
    return survivor &&
      !survivor.escaped &&
      survivor.state !== "seated" &&
      survivor.state !== "carried" &&
      survivor.state !== "eliminated";
  }

  function updateTwinGaze(dt, now) {
    if (!isTwinForm(TWIN_FORM_CHIYIN)) return;
    getSurvivors().forEach((survivor) => {
      if (!canTwinAffectSurvivor(survivor)) return;
      const dx = survivor.x - hunter.x;
      const dy = survivor.y - hunter.y;
      const distance = Math.hypot(dx, dy);
      if (distance > TWIN_GAZE_RANGE) return;
      const angle = Math.atan2(dy, dx);
      if (Math.abs(angleDifference(hunter.angle, angle)) > TWIN_GAZE_ARC / 2) return;
      if (!hasWalkableLine(hunter.x, hunter.y, survivor.x, survivor.y, hunter.radius)) return;
      addTwinShackle(survivor, TWIN_GAZE_GAIN * dt, now, false);
    });
  }

  function updateTwinShadowZones(dt, now) {
    for (let index = twinShadowZones.length - 1; index >= 0; index -= 1) {
      const zone = twinShadowZones[index];
      if (now >= zone.until) {
        twinShadowZones.splice(index, 1);
        continue;
      }
      getSurvivors().forEach((survivor) => {
        if (!canTwinAffectSurvivor(survivor)) return;
        if (distanceBetween(survivor, zone) <= zone.radius) {
          addTwinShackle(survivor, TWIN_SHADOW_LOCK_GAIN * dt, now, hunter.presenceTier >= 2);
        }
      });
    }
  }

  function updateTwinShackleDecay(dt, now) {
    getSurvivors().forEach((survivor) => {
      if (!survivor.shackleValue || now - (survivor.lastShackleAt || 0) < TWIN_SHACKLE_DECAY_DELAY) return;
      survivor.shackleValue = Math.max(0, survivor.shackleValue - TWIN_SHACKLE_DECAY * dt);
    });
  }

  function addTwinShackle(survivor, amount, now, damageOnFull) {
    if (now < (survivor.shackledUntil || 0)) return;
    survivor.shackleValue = Math.min(TWIN_SHACKLE_MAX, (survivor.shackleValue || 0) + amount);
    survivor.lastShackleAt = now;
    if (survivor.shackleValue < TWIN_SHACKLE_MAX) return;
    survivor.shackleValue = 0;
    if (isFlywheelActive(survivor, now)) {
      showAssistAlert("飞轮规避枷锁", now, 650);
      return;
    }
    if (!tryBlockShieldBearerNegativeStatus(survivor, now, "枷锁")) {
      survivor.shackledUntil = now + TWIN_SHACKLE_LOCK_DURATION;
    }
    if (damageOnFull) {
      applyHunterHit(survivor, now, {
        allowTerrorShock: false,
        applyBoneBleed: false,
        damage: 0.5
      });
    }
  }

  function updateTwinSwordProjectiles(dt, now) {
    for (let index = twinSwordProjectiles.length - 1; index >= 0; index -= 1) {
      const item = twinSwordProjectiles[index];
      const dx = item.vx * dt;
      const dy = item.vy * dt;
      item.x += dx;
      item.y += dy;
      item.traveled += Math.hypot(dx, dy);
      const target = getSurvivors().find((survivor) => {
        if (!canTwinAffectSurvivor(survivor) || survivor.state === "downed") return false;
        return distanceBetween(item, survivor) <= survivor.radius + TWIN_FLYING_SWORD_RADIUS;
      });
      if (target) {
        applyHunterHit(target, now, {
          allowTerrorShock: false,
          applyBoneBleed: false
        });
        twinSwordProjectiles.splice(index, 1);
        continue;
      }
      if (item.traveled >= TWIN_FLYING_SWORD_RANGE || collides(item.x, item.y, TWIN_FLYING_SWORD_RADIUS)) {
        twinSwordProjectiles.splice(index, 1);
      }
    }
  }

  function showTwinSkillFail(text, now = performance.now()) {
    lanternAlert = {
      text,
      until: now + 1100
    };
  }

  function getTwinSkillBlockReason(now) {
    if (!matchStarted || !isTwinSword()) return "未选择双生";
    if (hunter.action) return "动作中";
    if (hunter.carrying) return "牵人中";
    if (now < hunter.stunnedUntil || now < hunter.wipeUntil) return "硬直中";
    return "";
  }

  function canUseTwinSwordSkill(now, showReason = false) {
    const reason = getTwinSkillBlockReason(now);
    if (!reason) return true;
    if (showReason) showTwinSkillFail(reason, now);
    return false;
  }

  function switchTwinForm(now) {
    if (!canUseTwinSwordSkill(now, true)) return false;
    if (now < (hunter.nextTwinFormAt || 0)) {
      showTwinSkillFail("切换冷却中", now);
      return false;
    }
    hunter.twinForm = hunter.twinForm === TWIN_FORM_CHIYIN ? TWIN_FORM_QINGTIAN : TWIN_FORM_CHIYIN;
    hunter.nextTwinFormAt = now + TWIN_FORM_COOLDOWN;
    if (hunter.twinForm === TWIN_FORM_QINGTIAN) hunter.invisibleUntil = now + 5000;
    lanternAlert = {
      text: hunter.twinForm === TWIN_FORM_CHIYIN ? "池音形态" : "赵青天形态",
      until: now + 1400
    };
    return true;
  }

  function toggleTwinTimeMode() {
    if (!isTwinSword()) return;
    hunter.twinTimeMode = hunter.twinTimeMode === "self" ? "survivor" : "self";
    lanternAlert = {
      text: hunter.twinTimeMode === "self" ? "时之力 自身加速" : "时之力 求生减速",
      until: performance.now() + 1300
    };
  }

  function canActivateTwinDualCast(now) {
    return canUseTwinSwordSkill(now, true) &&
      hunter.presenceTier >= 1 &&
      now >= (hunter.nextTwinDualCastAt || 0);
  }

  function activateTwinDualCast(now) {
    if (!canActivateTwinDualCast(now)) {
      if (hunter.presenceTier < 1) showTwinSkillFail("需要一阶", now);
      else if (now < (hunter.nextTwinDualCastAt || 0)) showTwinSkillFail("双生冷却中", now);
      return false;
    }
    hunter.twinDualCastUntil = now + 8000;
    hunter.nextTwinDualCastAt = now + TWIN_DUAL_CAST_COOLDOWN;
    lanternAlert = {
      text: "双生之力 待发",
      until: now + 1400
    };
    return true;
  }

  function getTwinTimeFactor() {
    if (hunter.presenceTier >= 2) return Math.max(3, hunter.twinEnlightenmentCount || 0);
    return 2;
  }

  function startTwinAim(kind, now, clientX = null, clientY = null, pointerId = null, useLastPointer = true) {
    if (!canUseTwinSwordSkill(now, true)) return false;
    if (twinAim) return false;
    const target = getAimTargetFromPointer(clientX, clientY, useLastPointer) || {
      x: hunter.x + Math.cos(hunter.angle) * getTwinAimDefaultRange(kind),
      y: hunter.y + Math.sin(hunter.angle) * getTwinAimDefaultRange(kind)
    };
    twinAim = {
      kind,
      targetX: target.x,
      targetY: target.y,
      pointerId
    };
    return true;
  }

  function getTwinAimDefaultRange(kind) {
    if (kind === "sword") return TWIN_FLYING_SWORD_RANGE;
    if (kind === "secondary" && hunter.twinForm === TWIN_FORM_QINGTIAN) return hunter.presenceTier >= 2 ? 780 : TWIN_SPACE_POWER_RANGE;
    if (kind === "primary" && hunter.twinForm === TWIN_FORM_CHIYIN) return TWIN_SHADOW_LOCK_CAST_RANGE;
    return TWIN_SHADOW_STRIKE_CAST_RANGE;
  }

  function updateTwinAim(clientX, clientY, pointerId = null) {
    if (twinAim && twinAim.pointerId !== null && pointerId !== null && twinAim.pointerId !== pointerId) return;
    if (typeof clientX === "number" && typeof clientY === "number") rememberAimPointer(clientX, clientY);
    if (!twinAim) return;
    const target = getAimTargetFromPointer(clientX, clientY);
    if (!target) return;
    twinAim.targetX = target.x;
    twinAim.targetY = target.y;
  }

  function finishTwinAim(now, pointerId = null) {
    if (!twinAim) return false;
    if (twinAim.pointerId !== null && pointerId !== null && twinAim.pointerId !== pointerId) return false;
    const aim = twinAim;
    twinAim = null;
    if (!canUseTwinSwordSkill(now, true)) return false;
    if (aim.kind === "sword") return fireTwinFlyingSword(now, aim);
    const dual = hunter.presenceTier >= 1 && now < (hunter.twinDualCastUntil || 0);
    let used = false;
    if (hunter.twinForm === TWIN_FORM_QINGTIAN) {
      used = aim.kind === "primary" ? castTwinTimePower(now) : castTwinSpacePower(aim, now);
      if (dual) used = (aim.kind === "primary" ? castTwinShadowLock(aim, now, true) : castTwinShadowStrike(aim, now, true)) || used;
    } else {
      used = aim.kind === "primary" ? castTwinShadowLock(aim, now) : castTwinShadowStrike(aim, now);
      if (dual) used = (aim.kind === "primary" ? castTwinTimePower(now) : castTwinSpacePower(aim, now)) || used;
    }
    if (dual && used) hunter.twinDualCastUntil = 0;
    if (used) trackHunterSkillUseUnlock(now);
    return used;
  }

  function castTwinPrimaryInstant(now) {
    if (!canUseTwinSwordSkill(now, true)) return false;
    const dual = hunter.presenceTier >= 1 && now < (hunter.twinDualCastUntil || 0);
    const used = castTwinTimePower(now);
    if (dual && used) {
      castTwinShadowLock(getTwinAutoAim("primary"), now, true);
      hunter.twinDualCastUntil = 0;
    }
    if (used) trackHunterSkillUseUnlock(now);
    return used;
  }

  function getTwinAutoAim(kind) {
    const range = getTwinAimDefaultRange(kind);
    return {
      kind,
      targetX: hunter.x + Math.cos(hunter.angle) * range,
      targetY: hunter.y + Math.sin(hunter.angle) * range,
      pointerId: null
    };
  }

  function getClampedTwinAimPoint(aim, maxRange) {
    const dx = aim.targetX - hunter.x;
    const dy = aim.targetY - hunter.y;
    const distance = Math.hypot(dx, dy);
    const angle = distance > 6 ? Math.atan2(dy, dx) : hunter.angle;
    const range = Math.min(maxRange, Math.max(40, distance || maxRange));
    return {
      x: hunter.x + Math.cos(angle) * range,
      y: hunter.y + Math.sin(angle) * range,
      angle,
      range
    };
  }

  function spendTwinIntent(amount, now = performance.now()) {
    if ((hunter.twinIntent || 0) < amount) {
      showTwinSkillFail(`剑意不足 ${Math.floor(hunter.twinIntent || 0)}/${amount}`, now);
      return false;
    }
    hunter.twinIntent = Math.max(0, hunter.twinIntent - amount);
    return true;
  }

  function castTwinTimePower(now) {
    const factor = getTwinTimeFactor();
    const cost = hunter.presenceTier >= 2 ? 100 * factor : TWIN_TIME_POWER_COST;
    if (!spendTwinIntent(cost, now)) return false;
    hunter.twinTimePower = {
      kind: hunter.twinTimeMode || "self",
      factor,
      until: now + TWIN_TIME_POWER_DURATION
    };
    if (hunter.twinTimePower.kind === "survivor") {
      getSurvivors().forEach((survivor) => {
        if (tryBlockShieldBearerNegativeStatus(survivor, now, "时之减速")) {
          survivor.shieldTwinTimeImmuneUntil = hunter.twinTimePower.until;
        }
      });
    }
    lanternAlert = {
      text: hunter.twinTimeMode === "self" ? `时之力 x${factor}` : `时之力 /${factor}`,
      until: now + 1500
    };
    chasePulseUntil = now + 360;
    return true;
  }

  function castTwinSpacePower(aim, now) {
    const target = getClampedTwinAimPoint(aim, hunter.presenceTier >= 2 ? 780 : TWIN_SPACE_POWER_RANGE);
    const cost = hunter.presenceTier >= 2 ? Math.ceil(target.range / 26) * 5 : TWIN_SPACE_POWER_COST;
    if (!spendTwinIntent(cost, now)) return false;
    const safe = findNearestSafePosition(target.x, target.y, hunter.radius);
    hunter.x = safe.x;
    hunter.y = safe.y;
    hunter.vx = 0;
    hunter.vy = 0;
    hunter.path = [];
    hunter.pathGoal = null;
    chasePulseUntil = now + 420;
    return true;
  }

  function castTwinShadowLock(aim, now, ignoreCooldown = false) {
    if (!ignoreCooldown && now < (hunter.nextTwinShadowLockAt || 0)) return false;
    const target = getClampedTwinAimPoint(aim, TWIN_SHADOW_LOCK_CAST_RANGE);
    twinShadowZones.push({
      id: ++twinShadowZoneId,
      x: target.x,
      y: target.y,
      radius: TWIN_SHADOW_LOCK_RANGE,
      until: now + TWIN_SHADOW_LOCK_DURATION
    });
    if (!ignoreCooldown) hunter.nextTwinShadowLockAt = now + TWIN_SHADOW_LOCK_COOLDOWN;
    chasePulseUntil = now + 360;
    return true;
  }

  function castTwinShadowStrike(aim, now, ignoreCooldown = false) {
    if (!ignoreCooldown && now < (hunter.nextTwinShadowStrikeAt || 0)) return false;
    const target = getClampedTwinAimPoint(aim, TWIN_SHADOW_STRIKE_CAST_RANGE);
    getSurvivors().forEach((survivor) => {
      if (!canTwinAffectSurvivor(survivor)) return;
      if (distanceBetween(survivor, target) > TWIN_SHADOW_STRIKE_RANGE) return;
      applyHunterHit(survivor, now, {
        allowTerrorShock: false,
        applyBoneBleed: false,
        damage: 0.5
      });
      if (hunter.presenceTier >= 2) addTwinShackle(survivor, 20, now, false);
    });
    if (!ignoreCooldown) hunter.nextTwinShadowStrikeAt = now + TWIN_SHADOW_STRIKE_COOLDOWN;
    chasePulseUntil = now + 420;
    return true;
  }

  function fireTwinFlyingSword(now, aim = null) {
    if (!canUseTwinSwordSkill(now, true)) return false;
    if ((hunter.twinFlyingSwords || 0) <= 0) {
      showTwinSkillFail("没有飞剑", now);
      return false;
    }
    const target = aim ? getClampedTwinAimPoint(aim, TWIN_FLYING_SWORD_RANGE) : null;
    const angle = target ? target.angle : hunter.angle;
    hunter.twinFlyingSwords -= 1;
    twinSwordProjectiles.push({
      id: ++twinSwordProjectileId,
      x: hunter.x + Math.cos(angle) * (hunter.radius + 18),
      y: hunter.y + Math.sin(angle) * (hunter.radius + 18),
      vx: Math.cos(angle) * TWIN_FLYING_SWORD_SPEED,
      vy: Math.sin(angle) * TWIN_FLYING_SWORD_SPEED,
      angle,
      traveled: 0
    });
    chasePulseUntil = now + 320;
    trackHunterSkillUseUnlock(now);
    return true;
  }

  function startDismantleSoulLamp(actor, lamp, now) {
    if (!lamp || actor.action || actor.state !== "healthy" && actor.state !== "injured" || actor.escaped) return;
    actor.action = {
      kind: "dismantlingLamp",
      start: now,
      until: now + SOUL_LAMP_DISMANTLE_DURATION,
      lamp
    };
    actor.vx = 0;
    actor.vy = 0;
  }

  function startDismantleSoulPatrol(actor, point, now) {
    if (!isSoulPatrolPoint(point) || actor.action || actor.state !== "healthy" && actor.state !== "injured" || actor.escaped) return;
    actor.action = {
      kind: "dismantlingSoulPatrol",
      start: now,
      until: now + SOUL_PATROL_DISMANTLE_DURATION,
      point
    };
    actor.vx = 0;
    actor.vy = 0;
  }

  function finishDismantleSoulPatrol(action, now) {
    const point = action && action.point;
    if (!isSoulPatrolPoint(point)) return;
    point.soulPatrolAt = 0;
    if (hunter.soulPatrolPoint === point) hunter.soulPatrolPoint = null;
    chasePulseUntil = now + 320;
    showAssistAlert("魂印已拆除", now, 900);
  }

  function finishDismantleSoulLamp(action) {
    const lamp = action.lamp;
    const index = soulLamps.indexOf(lamp);
    if (index === -1) return;
    soulLamps.splice(index, 1);
    if (lanternAlert && lanternAlert.lamp === lamp) lanternAlert = null;
    chasePulseUntil = performance.now() + 320;
  }

  function startDismantlePeeperWard(actor, ward, now) {
    if (!ward || actor.action || actor.state !== "healthy" && actor.state !== "injured" || actor.escaped) return;
    actor.action = {
      kind: "dismantlingPeeper",
      start: now,
      until: now + ASSIST_PEEPER_DISMANTLE_DURATION,
      ward
    };
    actor.vx = 0;
    actor.vy = 0;
  }

  function finishDismantlePeeperWard(action, now) {
    const index = assistPeeperWards.indexOf(action.ward);
    if (index === -1) return;
    assistPeeperWards.splice(index, 1);
    chasePulseUntil = now + 320;
    showAssistAlert("插眼已拆除", now, 900);
  }

  function getCompletedRepairCount() {
    return repairPoints.filter((point) => point.completed).length;
  }

  function isHatchSpawned() {
    return hatch.spawned;
  }

  function isHatchOpen() {
    return hatch.spawned && hatch.opened;
  }

  function areExitsPowered() {
    return getCompletedRepairCount() >= REPAIR_REQUIRED;
  }

  function canBeHealed(survivor) {
    if (!isHealableState(survivor) || survivor.escaped) return false;
    return !survivor.action || survivor.action.kind === "beingHealed" || survivor.action.kind === "selfHealing";
  }

  function findNearestDownedSurvivor(actor, range) {
    let nearest = null;
    let nearestDistance = Infinity;
    getSurvivors().forEach((survivor) => {
      if (survivor.state !== "downed" || survivor.escaped) return;
      const distance = distanceBetween(actor, survivor);
      if (distance < range && distance < nearestDistance) {
        nearest = survivor;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function findNearestEmptyChair(actor, range) {
    let nearest = null;
    let nearestDistance = Infinity;
    chairs.forEach((item) => {
      if (item.destroyed || item.survivor) return;
      const distance = distanceBetween(actor, item);
      if (distance < range && distance < nearestDistance) {
        nearest = item;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function isHealableState(survivor) {
    return survivor.state === "injured" || survivor.state === "downed";
  }

  function placeStitchPack(apprentice, now, target = null) {
    if (!canPlaceStitchPack(apprentice)) return;
    if (target === apprentice || !target && canReceiveStitchPack(apprentice)) {
      applyStitchPack(apprentice, now, apprentice);
      apprentice.nextStitchPackAt = now + STITCH_PACK_COOLDOWN;
      apprentice.nextInteractAt = now + 450;
      apprentice.path = [];
      apprentice.pathGoal = null;
      if (apprentice.kind === "ai") apprentice.healDecision = null;
      return;
    }
    const placedNearTarget = target && canReceiveStitchPack(target) && distanceBetween(apprentice, target) < 280;
    const baseX = placedNearTarget ? target.x : apprentice.x + Math.cos(apprentice.angle) * 42;
    const baseY = placedNearTarget ? target.y : apprentice.y + Math.sin(apprentice.angle) * 42;
    const safe = findNearestSafePosition(baseX, baseY, 10);
    const existing = stitchPackDrops.find((item) => item.owner === apprentice);
    if (existing) {
      existing.x = safe.x;
      existing.y = safe.y;
      existing.createdAt = now;
    } else {
      stitchPackDrops.push({
        id: ++stitchPackDropId,
        owner: apprentice,
        x: safe.x,
        y: safe.y,
        createdAt: now
      });
    }
    apprentice.nextInteractAt = now + 450;
    apprentice.nextStitchPackAt = now + STITCH_PACK_COOLDOWN;
    apprentice.path = [];
    apprentice.pathGoal = null;
    if (apprentice.kind === "ai") apprentice.healDecision = null;
    chasePulseUntil = now + 260;
  }

  function applyStitchPack(target, now, from = null) {
    if (!target || !canReceiveStitchPack(target)) return;
    target.stitchPack = {
      from,
      appliedAt: now,
      healAt: now + STITCH_HEAL_DELAY
    };
    target.healProgress = 0;
    chasePulseUntil = now + 320;
  }

  function startHealing(healer, target, now) {
    if (hunter.carrying) return;
    if (isShieldBearerGuarding(healer, now)) return;
    if (healer.action || healer.state !== "healthy" && healer.state !== "injured" || !canBeHealed(target) || healer === target) return;
    if (healer.kind === "ai" && hunter.target === healer) return;
    healer.action = {
      kind: "healing",
      start: now,
      target,
      healer
    };
    if (!target.action || target.action.kind === "selfHealing") {
      target.action = {
        kind: "beingHealed",
        start: now,
        target
      };
    }
    if (healer.kind === "ai") healer.healDecision = null;
    if (target.kind === "ai") target.healDecision = null;
    healer.vx = 0;
    healer.vy = 0;
    target.vx = 0;
    target.vy = 0;
  }

  function startSelfHealing(actor, now) {
    if (hunter.carrying) return false;
    if (!actor || actor.action || actor.escaped || actor.state !== "downed" || isBeingPickedUp(actor)) return false;
    if (actor.selfHealUsed && (actor.healProgress || 0) >= SELF_HEAL_CAP) return false;
    actor.action = {
      kind: "selfHealing",
      start: now,
      lastUpdate: now,
      actor
    };
    actor.vx = 0;
    actor.vy = 0;
    actor.healDecision = null;
    return true;
  }

  function cancelHealingDuringCarry(actor) {
    if (!hunter.carrying || !actor || !actor.action || !["healing", "beingHealed", "selfHealing"].includes(actor.action.kind)) return false;
    cancelHealing(actor.action);
    actor.action = null;
    actor.healDecision = null;
    actor.vx = 0;
    actor.vy = 0;
    return true;
  }

  function startRepair(actor, point, now) {
    if (isPracticeTargetMode() && actor.kind === "ai") return;
    if (isGeneralRiding(actor, now)) return;
    if (isShieldBearerGuarding(actor, now)) return;
    if (areExitsPowered()) return;
    if (actor.action || actor.state === "downed" || actor.escaped || point.completed || isRepairingPoint(actor, point)) return;
    if (isFinalCipherPoint(point) && (point.progress || 0) >= FINAL_CIPHER_PRIME_PROGRESS && shouldCompletePrimedFinalCipher(actor, now)) {
      finishRepair(point);
      return;
    }
    const baseDuration = actor === player && selectedRole === PLAYER_ROLE.survivor
      ? PLAYER_REPAIR_DURATION
      : AI_REPAIR_DURATION;
    const duration = getSurvivorRepairDuration(actor, baseDuration);
    actor.action = {
      kind: "repairing",
      start: now,
      point,
      actor,
      duration,
      calibration: null,
      calibrationFeedback: null,
      forcedTunerCalibrations: 0,
      soulNoiseNextAt: isSoulPatrolPoint(point) ? now + SOUL_NOISE_MARK_INTERVAL : 0,
      nextCalibrationAt: getNextRepairCalibrationAt(now, true)
    };
    point.workers.push(actor);
    actor.vx = 0;
    actor.vy = 0;
  }

  function finishRepair(point) {
    const exitsWerePowered = areExitsPowered();
    trackTunerFirstCipherUnlock(point);
    point.progress = 1;
    point.completed = true;
    point.soulPatrolAt = 0;
    point.soulPatrolDecayUntil = 0;
    point.nextSoulPatrolDecayAt = 0;
    point.abnormalDecayUntil = 0;
    point.nextAbnormalDecayAt = 0;
    if (finalCipherGuard && finalCipherGuard.point === point) finalCipherGuard = null;
    point.workers.forEach((worker) => {
      if (worker.action && worker.action.kind === "repairing" && worker.action.point === point) {
        worker.action = null;
      }
    });
    point.workers = [];
    chasePulseUntil = performance.now() + 360;
    getSurvivors().forEach((survivor) => {
      if (survivor.objectiveDecision && survivor.objectiveDecision.target === point) {
        survivor.objectiveDecision = null;
      }
    });
    if (!exitsWerePowered && areExitsPowered()) triggerAdrenalineBadges(performance.now());
  }

  function triggerAdrenalineBadges(now) {
    hunter.mirrorEndgameFourSafe = getSurvivors().length === 4 && getSurvivors().every((survivor) => survivor.state !== "eliminated");
    let activated = 0;
    getSurvivors().forEach((survivor) => {
      if (!hasSurvivorBadge(survivor, "adrenaline") || survivor.adrenalineTriggered) return;
      if (survivor.escaped || survivor.state === "eliminated" || survivor.state === "seated" || survivor.state === "carried") return;
      survivor.adrenalineTriggered = true;
      activated += 1;
      restoreOneHealthState(survivor, now);
      survivor.endgameBoostUntil = Math.max(survivor.endgameBoostUntil || 0, now + ADRENALINE_BOOST_DURATION);
    });
    if (activated > 0) showAssistAlert("回光返照", now, 1400);
  }

  function restoreOneHealthState(survivor, now) {
    survivor.damageProgress = 0;
    survivor.healProgress = 0;
    if (survivor.state === "downed") {
      survivor.state = "injured";
      survivor.injuredAt = now;
      survivor.downedAt = null;
      survivor.action = null;
      return;
    }
    if (survivor.state === "injured") {
      survivor.state = "healthy";
      survivor.injuredAt = null;
    }
  }

  function cancelRepair(action) {
    if (!action || !action.point) return;
    action.point.workers = action.point.workers.filter((worker) => worker !== action.actor);
  }

  function updateSoulNoise(action, now) {
    if (!action || !isSoulPatrolPoint(action.point) || !isSoulBinder()) return;
    if (!action.soulNoiseNextAt) action.soulNoiseNextAt = now + SOUL_NOISE_MARK_INTERVAL;
    if (now < action.soulNoiseNextAt) return;
    const intervals = Math.max(1, Math.floor((now - action.soulNoiseNextAt) / SOUL_NOISE_MARK_INTERVAL) + 1);
    action.soulNoiseNextAt += intervals * SOUL_NOISE_MARK_INTERVAL;
    const gained = addSoulMark(action.actor, intervals);
    if (gained > 0 && action.actor === player) showAssistAlert(`魂噪 · 魂印+${gained}`, now, 900);
  }

  function getNextRepairCalibrationAt(now, first = false) {
    const min = first ? REPAIR_CALIBRATION_FIRST_MIN : REPAIR_CALIBRATION_INTERVAL_MIN;
    const max = first ? REPAIR_CALIBRATION_FIRST_MAX : REPAIR_CALIBRATION_INTERVAL_MAX;
    return now + min + Math.random() * (max - min);
  }

  function updateRepairCalibration(action, now) {
    if (!action) return;
    if (action.calibrationFeedback && now >= action.calibrationFeedback.until) action.calibrationFeedback = null;
    if (!action.calibration && (action.forcedTunerCalibrations || 0) > 0) {
      startRepairCalibration(action, now, true);
    } else if (!action.calibration && now >= (action.nextCalibrationAt || Infinity)) {
      startRepairCalibration(action, now);
    }
    if (action.calibration && isAIControlledRepairCalibration(action.actor) && now >= (action.calibration.aiResolveAt || Infinity)) {
      finishRepairCalibration(action, now, action.calibration.aiResult || "success");
      return;
    }
    if (action.calibration && now >= action.calibration.until) {
      finishRepairCalibration(action, now, "fail");
    }
  }

  function startRepairCalibration(action, now, forcedBySorrow = false) {
    const successSize = REPAIR_CALIBRATION_SUCCESS_SIZE * getRepairCalibrationRangeMultiplier(action.actor);
    const perfectSize = REPAIR_CALIBRATION_PERFECT_SIZE * getRepairCalibrationRangeMultiplier(action.actor);
    const successStart = 0.44 + Math.random() * 0.24;
    const successEnd = Math.min(0.92, successStart + successSize);
    const perfectStart = successStart + (successEnd - successStart - perfectSize) * (0.35 + Math.random() * 0.3);
    action.calibration = {
      start: now,
      until: now + REPAIR_CALIBRATION_DURATION,
      successStart,
      successEnd,
      perfectStart,
      perfectEnd: perfectStart + perfectSize,
      forcedBySorrow
    };
    if (isAIControlledRepairCalibration(action.actor)) setAIRepairCalibrationPlan(action.calibration);
    action.calibrationFeedback = null;
  }

  function isAIControlledRepairCalibration(actor) {
    return actor !== player || selectedRole !== PLAYER_ROLE.survivor;
  }

  function setAIRepairCalibrationPlan(calibration) {
    const roll = Math.random();
    if (roll < AI_REPAIR_CALIBRATION_PERFECT_CHANCE) {
      calibration.aiResult = "perfect";
      calibration.aiResolveAt = calibration.start + (calibration.until - calibration.start) * ((calibration.perfectStart + calibration.perfectEnd) / 2);
      return;
    }
    if (roll < AI_REPAIR_CALIBRATION_PERFECT_CHANCE + AI_REPAIR_CALIBRATION_FAIL_CHANCE) {
      calibration.aiResult = "fail";
      calibration.aiResolveAt = calibration.start + (calibration.until - calibration.start) * Math.max(0.08, calibration.successStart * 0.55);
      return;
    }
    calibration.aiResult = "success";
    calibration.aiResolveAt = calibration.start + (calibration.until - calibration.start) * ((calibration.successStart + calibration.successEnd) / 2);
  }

  function getRepairCalibrationRangeMultiplier(actor) {
    return isClockmaker(actor) ? CLOCKMAKER_CALIBRATION_RANGE_MULTIPLIER : 1;
  }

  function getRepairCalibrationBonus(actor) {
    return isClockmaker(actor) ? CLOCKMAKER_CALIBRATION_BONUS : 0;
  }

  function resolvePlayerRepairCalibration(now) {
    const action = player.action;
    if (!action || action.kind !== "repairing" || !action.calibration) return false;
    const needle = getRepairCalibrationNeedle(action.calibration, now);
    if (needle >= action.calibration.perfectStart && needle <= action.calibration.perfectEnd) {
      finishRepairCalibration(action, now, "perfect");
    } else if (needle >= action.calibration.successStart && needle <= action.calibration.successEnd) {
      finishRepairCalibration(action, now, "success");
    } else {
      finishRepairCalibration(action, now, "fail");
    }
    return true;
  }

  function getRepairCalibrationNeedle(calibration, now) {
    if (!calibration) return 0;
    return Math.max(0, Math.min(1, (now - calibration.start) / Math.max(calibration.until - calibration.start, 1)));
  }

  function finishRepairCalibration(action, now, result) {
    if (!action || !action.point || !action.calibration) return;
    const forcedBySorrow = action.calibration.forcedBySorrow;
    action.calibration = null;
    if (forcedBySorrow) action.forcedTunerCalibrations = Math.max(0, (action.forcedTunerCalibrations || 0) - 1);
    action.nextCalibrationAt = forcedBySorrow && (action.forcedTunerCalibrations || 0) > 0 ? now : getNextRepairCalibrationAt(now);

    if (result === "perfect") {
      const bonus = REPAIR_CALIBRATION_PERFECT_BONUS + getRepairCalibrationBonus(action.actor);
      applyRepairCalibrationDelta(action, bonus);
      addTunerResonance(action.actor, TUNER_CALIBRATION_PERFECT_RESONANCE);
      action.calibrationFeedback = { label: `完美校准 +${Math.round(bonus * 100)}%`, color: "#d9b76a", until: now + 1200 };
    } else if (result === "success") {
      const bonus = REPAIR_CALIBRATION_SUCCESS_BONUS + getRepairCalibrationBonus(action.actor);
      applyRepairCalibrationDelta(action, bonus);
      addTunerResonance(action.actor, TUNER_CALIBRATION_SUCCESS_RESONANCE);
      action.calibrationFeedback = { label: `校准成功 +${Math.round(bonus * 100)}%`, color: "#b7d6c1", until: now + 1200 };
    } else {
      applyRepairCalibrationDelta(action, -REPAIR_CALIBRATION_FAIL_PENALTY);
      action.calibrationFeedback = { label: "炸机 -5% · 眩晕", color: "#b95f52", until: now + 1400 };
      stunActorFromRepairCalibration(action, now);
      chasePulseUntil = now + 520;
    }
  }

  function stunActorFromRepairCalibration(action, now) {
    const actor = action && action.actor;
    if (!actor) return;
    cancelRepair(action);
    actor.action = {
      kind: "repairStun",
      start: now,
      until: now + REPAIR_CALIBRATION_FAIL_STUN_DURATION
    };
    actor.vx = 0;
    actor.vy = 0;
    actor.nextInteractAt = now + REPAIR_CALIBRATION_FAIL_STUN_DURATION;
    if (actor === player && selectedRole === PLAYER_ROLE.survivor) showAssistAlert("炸机眩晕", now, 900);
  }

  function applyRepairCalibrationDelta(action, delta) {
    const point = action.point;
    if (!point || point.completed) return;
    point.progress = Math.max(0, Math.min(1, point.progress + delta));
    if (point.progress >= 1) finishRepair(point);
  }

  function startOpenGate(actor, gate, now) {
    if (actor.action || actor.state === "downed" || actor.escaped || !areExitsPowered() || gate.opened || isOpeningGate(actor, gate)) return;
    if (!isActorInGateUseRange(actor, gate)) return;
    actor.action = {
      kind: "openingGate",
      start: now,
      lastUpdate: now,
      gate,
      actor,
      duration: GATE_OPEN_DURATION
    };
    gate.workers.push(actor);
    actor.vx = 0;
    actor.vy = 0;
  }

  function finishOpenGate(gate) {
    gate.progress = 1;
    gate.opened = true;
    gate.workers.forEach((worker) => {
      if (worker.action && worker.action.kind === "openingGate" && worker.action.gate === gate) {
        worker.action = null;
      }
    });
    gate.workers = [];
    chasePulseUntil = performance.now() + 360;
  }

  function cancelGateOpen(action) {
    if (!action || !action.gate) return;
    action.gate.workers = action.gate.workers.filter((worker) => worker !== action.actor);
  }

  function startEscape(actor, gate, now) {
    if (actor.action || actor.escaped || !areExitsPowered() || !gate.opened) return;
    if (actor.state !== "healthy" && actor.state !== "injured" && actor.state !== "downed") return;
    if (!isActorInGateUseRange(actor, gate, getAIGateEscapePoint(actor, gate))) return;
    actor.action = {
      kind: "escaping",
      start: now,
      until: now + GATE_ESCAPE_DURATION,
      gate
    };
    actor.vx = 0;
    actor.vy = 0;
  }

  function startHatchEscape(actor, now) {
    if (actor.action || actor.escaped || !isHatchOpen()) return;
    if (actor.state !== "healthy" && actor.state !== "injured" && actor.state !== "downed") return;
    actor.action = {
      kind: "escaping",
      start: now,
      until: now + HATCH_ESCAPE_DURATION,
      hatch
    };
    actor.vx = 0;
    actor.vy = 0;
  }

  function finishEscape(actor) {
    actor.escaped = true;
    actor.action = null;
    actor.path = [];
    actor.pathGoal = null;
    actor.kiteDecision = null;
    actor.healDecision = null;
    actor.objectiveDecision = null;
    chasePulseUntil = performance.now() + 360;
  }

  function startPickupSurvivor(survivor, now) {
    if (!survivor || hunter.carrying || hunter.action || survivor.state !== "downed") return;
    hunter.action = {
      kind: "pickingUp",
      start: now,
      until: now + PICKUP_SURVIVOR_DURATION,
      target: survivor
    };
    hunter.status = "pickingUp";
    hunter.vx = 0;
    hunter.vy = 0;
    survivor.vx = 0;
    survivor.vy = 0;
    chasePulseUntil = now + 260;
  }

  function isBeingPickedUp(survivor) {
    return Boolean(
      survivor &&
      hunter.action &&
      hunter.action.kind === "pickingUp" &&
      hunter.action.target === survivor
    );
  }

  function finishPickupSurvivor(survivor) {
    if (!survivor || hunter.carrying || survivor.state !== "downed") return;
    cancelSurvivorAction(survivor);
    survivor.state = "carried";
    survivor.chair = null;
    survivor.carryProgress = 0;
    survivor.downedAt = null;
    survivor.vx = 0;
    survivor.vy = 0;
    survivor.path = [];
    survivor.pathGoal = null;
    hunter.carrying = survivor;
    hunter.status = "carrying";
    updateCarriedSurvivorPosition();
  }

  function cancelPickupAction(action, now = performance.now(), releaseAsInjured = false) {
    if (!action || action.kind !== "pickingUp") return;
    if (!action.target || action.target.state !== "downed") return;
    if (releaseAsInjured) {
      dropPickupTargetFromControl(action.target, now);
      return;
    }
    action.target.vx = 0;
    action.target.vy = 0;
  }

  function updateCarriedSurvivorPosition() {
    if (!hunter.carrying) return;
    const carried = hunter.carrying;
    carried.x = hunter.x - Math.cos(hunter.angle) * 26;
    carried.y = hunter.y - Math.sin(hunter.angle) * 26;
    carried.angle = hunter.angle;
    carried.vx = hunter.vx;
    carried.vy = hunter.vy;
  }

  function updateCarryStruggle(dt, now) {
    const carried = hunter.carrying;
    if (!carried) return;
    if (carried.state !== "carried") {
      hunter.carrying = null;
      return;
    }

    carried.carryProgress = Math.min(1, (carried.carryProgress || 0) + (dt * 1000) / CARRY_STRUGGLE_DURATION);
    if (carried.carryProgress >= 1) {
      breakFreeFromCarry(carried, now);
      return;
    }

    updateCarriedSurvivorPosition();
  }

  function breakFreeFromCarry(survivor, now) {
    if (!survivor || hunter.carrying !== survivor) return;
    hunter.carrying = null;
    survivor.state = "injured";
    survivor.injuredAt = now;
    survivor.carryProgress = 0;
    survivor.chair = null;
    survivor.action = null;
    survivor.downedAt = null;
    survivor.boostUntil = now + getSurvivorHitBoostDuration(survivor, RESCUE_SPEED_BOOST_DURATION);
    survivor.path = [];
    survivor.pathGoal = null;
    survivor.healDecision = null;
    survivor.objectiveDecision = null;

    const safe = findNearestSafePosition(
      hunter.x - Math.cos(hunter.angle) * 92,
      hunter.y - Math.sin(hunter.angle) * 92,
      survivor.radius
    );
    survivor.x = safe.x;
    survivor.y = safe.y;
    survivor.vx = 0;
    survivor.vy = 0;
    if (consumeExcitementGuard(now)) return;
    hunter.stunnedUntil = now + CARRY_ESCAPE_STUN;
    hunter.wipeUntil = 0;
    hunter.status = "stunned";
    hunter.path = [];
    hunter.pathGoal = null;
    chasePulseUntil = now + 360;
  }

  function dropCarriedSurvivorFromControl(now) {
    const carried = hunter.carrying;
    if (!carried) return;
    hunter.carrying = null;
    carried.state = "injured";
    carried.injuredAt = now;
    carried.carryProgress = 0;
    carried.chair = null;
    carried.action = null;
    carried.downedAt = null;
    carried.boostUntil = now + getSurvivorHitBoostDuration(carried, 900);
    carried.path = [];
    carried.pathGoal = null;
    carried.healDecision = null;
    carried.objectiveDecision = null;
    const safe = findNearestSafePosition(
      hunter.x - Math.cos(hunter.angle) * 74,
      hunter.y - Math.sin(hunter.angle) * 74,
      carried.radius
    );
    carried.x = safe.x;
    carried.y = safe.y;
    carried.vx = 0;
    carried.vy = 0;
  }

  function dropPickupTargetFromControl(survivor, now) {
    survivor.state = "injured";
    survivor.injuredAt = now;
    survivor.carryProgress = 0;
    survivor.chair = null;
    survivor.action = null;
    survivor.downedAt = null;
    survivor.boostUntil = now + getSurvivorHitBoostDuration(survivor, 900);
    survivor.path = [];
    survivor.pathGoal = null;
    survivor.healDecision = null;
    survivor.objectiveDecision = null;
    const safe = findNearestSafePosition(
      hunter.x - Math.cos(hunter.angle) * 74,
      hunter.y - Math.sin(hunter.angle) * 74,
      survivor.radius
    );
    survivor.x = safe.x;
    survivor.y = safe.y;
    survivor.vx = 0;
    survivor.vy = 0;
  }

  function interruptHunterByStun(now, duration) {
    if (consumeExcitementGuard(now)) return null;
    if (isTwinSword() && (hunter.twinFlyingSwords || 0) > 0) {
      hunter.twinFlyingSwords -= 1;
      lanternAlert = {
        text: "飞剑抵消控制",
        until: now + 1300
      };
      chasePulseUntil = now + 320;
      return null;
    }
    const carriedTarget = hunter.carrying;
    const pickupTarget = hunter.action && hunter.action.kind === "pickingUp" ? hunter.action.target : null;
    if (hunter.action && hunter.action.kind === "attackWindup") {
      hunter.action = null;
      hunter.lastAttackHit = false;
    }
    cancelSawDashByControl(now);
    cancelDanceStepByControl(now);
    if (hunter.action && hunter.action.kind === "pickingUp") {
      cancelPickupAction(hunter.action, now, true);
      hunter.action = null;
    }
    dropCarriedSurvivorFromControl(now);
    hunter.stunnedUntil = Math.max(hunter.stunnedUntil, now + duration);
    hunter.wipeUntil = 0;
    hunter.status = "stunned";
    hunter.path = [];
    hunter.pathGoal = null;
    hunter.vx = 0;
    hunter.vy = 0;
    const rescuedTarget = carriedTarget || pickupTarget;
    return rescuedTarget && rescuedTarget.state === "injured" ? rescuedTarget : null;
  }

  function consumeExcitementGuard(now) {
    if (now >= (hunter.excitementGuardUntil || 0)) return false;
    hunter.excitementGuardUntil = 0;
    showAssistAlert("兴奋抵消眩晕", now, 1000);
    chasePulseUntil = now + 320;
    return true;
  }

  function getHunterCarrySpeedMultiplier() {
    if (!hunter.carrying) return 1;
    return Math.max(0.66, 0.84 - (hunter.carrying.carryProgress || 0) * 0.18);
  }

  function startChairSurvivor(survivor, targetChair, now) {
    if (!survivor || !targetChair || targetChair.destroyed || targetChair.survivor || survivor.state !== "carried") return;
    if (survivor.nextChairEliminates && !(isKiteSimulatorMode() && survivor === player)) {
      survivor.chair = targetChair;
      targetChair.survivor = survivor;
      hunter.carrying = null;
      survivor.carryProgress = 0;
      eliminateSurvivor(survivor);
      hunter.status = "chasing";
      chasePulseUntil = now + 360;
      return;
    }

    survivor.state = "seated";
    survivor.x = targetChair.x;
    survivor.y = targetChair.y;
    survivor.vx = 0;
    survivor.vy = 0;
    survivor.action = null;
    survivor.chair = targetChair;
    survivor.chairStart = now;
    survivor.carryProgress = 0;
    survivor.downedAt = null;
    targetChair.survivor = survivor;
    hunter.carrying = null;
    hunter.status = "chasing";
    chasePulseUntil = now + 360;
  }

  function startRescue(rescuer, target, now) {
    if (!target || target.state !== "seated" || !target.chair || isBeingRescued(target) || rescuer.action || rescuer.state !== "healthy" && rescuer.state !== "injured") return;
    const rescueUntil = now + getSurvivorRescueDuration(rescuer);
    rescuer.action = {
      kind: "rescuing",
      start: now,
      until: rescueUntil,
      target,
      rescuer
    };
    target.chairProgressPausedUntil = Math.max(target.chairProgressPausedUntil || 0, rescueUntil);
    rescuer.vx = 0;
    rescuer.vy = 0;
  }

  function finishRescue(action) {
    const target = action.target;
    if (!target || target.state !== "seated" || !target.chair) return;
    const rescuer = action.rescuer;
    const now = performance.now();
    const chair = target.chair;
    if (target.chairProgress >= 0.5) {
      target.nextChairEliminates = true;
    } else {
      target.chairProgress = 0.5;
      target.nextChairEliminates = false;
    }
    target.state = "injured";
    target.chairProgressPausedUntil = 0;
    target.injuredAt = now;
    target.action = null;
    target.chair = null;
    target.carryProgress = 0;
    target.downedAt = null;
    target.boostUntil = now + getSurvivorHitBoostDuration(target, RESCUE_SPEED_BOOST_DURATION);
    chair.survivor = null;
    const safe = findNearestSafePosition(chair.x + 58, chair.y + 36, target.radius);
    target.x = safe.x;
    target.y = safe.y;
    target.path = [];
    target.pathGoal = null;
    target.healDecision = null;
    target.objectiveDecision = null;
    applyMedicRescueShield(rescuer, target, now);
    applyBorrowedTimeRescue(rescuer, target, now);
    settleMedicRescueShockDamage(rescuer, now);
    trackPlayerRescue(rescuer.kind === "actorRescuePhantom" ? rescuer.owner : rescuer, target, now);
    if (rescuer.kind === "actorRescuePhantom") {
      rescuer.rescueCompleted = true;
      rescuer.until = now;
    }
    chasePulseUntil = now + 360;
  }

  function applyMedicRescueShield(rescuer, target, now) {
    if (!isMedic(rescuer)) return;
    [rescuer, target].forEach((survivor) => {
      if (!survivor || survivor.escaped || survivor.state === "eliminated") return;
      survivor.medicShieldUntil = now + MEDIC_RESCUE_SHIELD_DURATION;
      survivor.medicShieldHits = 1;
      survivor.medicShieldSource = "medic";
    });
    showAssistAlert("前线护盾", now, 1000);
  }

  function applyBorrowedTimeRescue(rescuer, target, now) {
    const badgeHolder = rescuer && rescuer.kind === "actorRescuePhantom" ? rescuer.owner : rescuer;
    if (!badgeHolder || !hasSurvivorBadge(badgeHolder, "borrowedTime") || badgeHolder.borrowedTimeUsed) return;
    badgeHolder.borrowedTimeUsed = true;
    const protectedSurvivors = rescuer && rescuer.kind === "actorRescuePhantom" ? [target] : [rescuer, target];
    protectedSurvivors.forEach((survivor) => {
      if (!survivor || survivor.escaped || survivor.state === "eliminated") return;
      survivor.borrowedTimeUntil = Math.max(survivor.borrowedTimeUntil || 0, now + BORROWED_TIME_DURATION);
      survivor.borrowedTimePendingDamage = 0;
    });
    showAssistAlert("搏命挣扎", now, 1200);
  }

  function isBeingRescued(target) {
    return getSurvivors().some((survivor) => survivor.action && survivor.action.kind === "rescuing" && survivor.action.target === target) ||
      actorDecoys.some((decoy) => decoy.action && decoy.action.kind === "rescuing" && decoy.action.target === target);
  }

  function eliminateSurvivor(survivor) {
    if (!survivor || survivor.state === "eliminated") return;
    if (isKiteSimulatorMode() && survivor === player) {
      survivor.nextChairEliminates = false;
      survivor.carryProgress = 0;
      survivor.downedAt = null;
      survivor.chairProgress = Math.min(survivor.chairProgress || 0, 0.99);
      return;
    }
    if (survivor.chair) {
      survivor.chair.survivor = null;
      survivor.chair.destroyed = true;
    }
    if (hunter.carrying === survivor) hunter.carrying = null;
    cancelSurvivorAction(survivor);
    survivor.state = "eliminated";
    survivor.escaped = false;
    survivor.chair = null;
    survivor.nextChairEliminates = false;
    survivor.carryProgress = 0;
    survivor.downedAt = null;
    survivor.stitchPack = null;
    survivor.timeDevice = null;
    survivor.invisibleUntil = 0;
    survivor.vx = 0;
    survivor.vy = 0;
    survivor.path = [];
    survivor.pathGoal = null;
    chasePulseUntil = performance.now() + 360;
  }

  function cancelSurvivorAction(survivor) {
    const action = survivor.action;
    if (!action) return;
    if (action.kind === "healing" || action.kind === "beingHealed") cancelHealing(action);
    if (action.kind === "repairing") cancelRepair(action);
    if (action.kind === "openingGate") cancelGateOpen(action);
    survivor.action = null;
  }

  function shouldCancelActionOnMove(actor, move) {
    if (!actor.action || move.length <= 0.12) return false;
    if (actor.state !== "healthy" && actor.state !== "injured") return false;
    return ["healing", "beingHealed", "repairing", "openingGate", "escaping", "rescuing", "dismantlingLamp", "dismantlingPeeper", "dismantlingSoulPatrol"].includes(actor.action.kind);
  }

  function cancelActionFromMovement(actor) {
    if (!actor.action) return;
    const action = actor.action;
    if (action.kind === "healing" || action.kind === "beingHealed") cancelHealing(action);
    if (action.kind === "repairing") cancelRepair(action);
    if (action.kind === "openingGate") cancelGateOpen(action);
    actor.action = null;
    actor.vx = 0;
    actor.vy = 0;
  }

  function recoverActorsFromStuckStates(now) {
    getSurvivors().forEach((survivor) => recoverSurvivorState(survivor, now));
    recoverActorPosition(hunter);
    recoverStaleTimedAction(hunter, now);
  }

  function recoverSurvivorState(survivor, now) {
    if (survivor.state === "eliminated" || survivor.state === "seated" || survivor.state === "carried") return;
    recoverActorPosition(survivor);
    recoverStaleTimedAction(survivor, now);
    recoverAIPathStall(survivor, now);
  }

  function recoverAIPathStall(survivor, now) {
    const isKiting = hunter.target === survivor;
    const canBeStuck = survivor.kind === "ai" &&
      !survivor.escaped &&
      (survivor.state === "healthy" || survivor.state === "injured") &&
      !survivor.action &&
      Boolean(survivor.pathGoal || survivor.objectiveDecision || survivor.kiteDecision || survivor.kiteEscapeOverride || survivor.wanderTarget);
    if (!canBeStuck) {
      survivor.aiPathStall = null;
      return;
    }

    const previous = survivor.aiPathStall;
    if (!previous) {
      survivor.aiPathStall = { x: survivor.x, y: survivor.y, at: now, stalls: 0 };
      return;
    }
    const checkInterval = isKiting ? AI_KITE_PATH_STALL_CHECK_INTERVAL : AI_PATH_STALL_CHECK_INTERVAL;
    const minDistance = isKiting ? AI_KITE_PATH_STALL_MIN_DISTANCE : AI_PATH_STALL_MIN_DISTANCE;
    if (now - previous.at < checkInterval) return;

    const moved = Math.hypot(survivor.x - previous.x, survivor.y - previous.y);
    if (moved >= minDistance) {
      survivor.aiPathStall = { x: survivor.x, y: survivor.y, at: now, stalls: 0 };
      return;
    }

    const stalls = previous.stalls + 1;
    const fallback = getAIReachableUnstuckPoint(survivor, hunter);
    survivor.path = [];
    survivor.pathGoal = null;
    survivor.repathAt = 0;
    survivor.objectiveDecision = null;
    survivor.kiteDecision = null;
    survivor.healDecision = null;
    survivor.aiTask = null;

    if (isKiting && fallback) {
      survivor.kiteEscapeOverride = { destination: fallback, until: now + AI_KITE_UNSTUCK_DURATION };
      survivor.wanderTarget = null;
    } else if (fallback) {
      survivor.wanderTarget = fallback;
    } else {
      survivor.wanderTarget = pickWanderTarget();
    }
    survivor.aiPathStall = { x: survivor.x, y: survivor.y, at: now, stalls: stalls >= 2 ? 0 : stalls };
  }

  function recoverActorPosition(actor) {
    if (actor.action && ["vaulting", "breaking"].includes(actor.action.kind)) return;
    if (!collides(actor.x, actor.y, Math.max(STUCK_RECOVERY_RADIUS, actor.radius))) return;
    const safe = findNearestSafePosition(actor.x, actor.y, actor.radius);
    actor.x = safe.x;
    actor.y = safe.y;
    actor.vx = 0;
    actor.vy = 0;
    actor.path = [];
    actor.pathGoal = null;
    actor.repathAt = 0;
  }

  function recoverStaleTimedAction(actor, now) {
    if (!actor.action || !actor.action.until) return;
    if (actor.action.kind === "sawDash" && actor.action.noTimeLimit) return;
    if (now <= actor.action.until + ACTION_STALE_GRACE) return;

    const action = actor.action;
    if (action.kind === "repairing") cancelRepair(action);
    if (action.kind === "openingGate") cancelGateOpen(action);
    if (action.kind === "healing" || action.kind === "beingHealed") cancelHealing(action);
    actor.action = null;

    if (typeof action.toX === "number" && typeof action.toY === "number") {
      const safe = findNearestSafePosition(action.toX, action.toY, actor.radius);
      actor.x = safe.x;
      actor.y = safe.y;
    }
    actor.vx = 0;
    actor.vy = 0;
  }

  function finishHealing(target) {
    const now = performance.now();
    const activeHealers = getActiveHealers(target);
    const playerHealedTeammate = activeHealers.includes(player) && target !== player;
    const retainedDamageProgress = Math.max(0, target.damageProgress || 0);
    activeHealers.forEach((healer) => {
      healer.action = null;
    });
    if (target.state === "downed") {
      target.state = "injured";
      target.injuredAt = now;
      target.boostUntil = now + getSurvivorHitBoostDuration(target, 900);
      target.carryProgress = 0;
      target.downedAt = null;
    } else if (target.state === "injured") {
      target.state = "healthy";
      target.injuredAt = null;
      target.boostUntil = 0;
    }
    target.healProgress = 0;
    target.damageProgress = retainedDamageProgress;
    clearOneSoulMark(target);
    target.stitchPack = null;
    target.action = null;
    target.kiteDecision = null;
    target.healDecision = null;
    target.path = [];
    target.pathGoal = null;
    target.repathAt = 0;
    activeHealers.some((healer) => applyPhysicianBenevolence(healer, target, now));
    if (playerHealedTeammate) trackPlayerHealTeammate(target);
  }

  function cancelHealing(action) {
    if (!action) return;
    if (action.kind === "beingHealed") {
      getActiveHealers(action.target).forEach((healer) => {
        healer.action = null;
      });
      if (action.target && action.target.action === action) action.target.action = null;
      return;
    }

    if (action.kind === "healing") {
      const target = action.target;
      const remainingHealers = target ? getActiveHealers(target).filter((healer) => healer !== action.healer) : [];
      if (target && target.action && target.action.kind === "beingHealed" && remainingHealers.length === 0) {
        target.action = null;
      }
    }
  }

  function getActiveHealers(target) {
    return getSurvivors().filter((survivor) => {
      if (survivor === target || survivor.escaped) return false;
      return survivor.action &&
        survivor.action.kind === "healing" &&
        survivor.action.target === target &&
        isHealableState(target) &&
        distanceBetween(survivor, target) <= 112;
    });
  }

  function isSurvivorInHunterAttackCone(survivor, rangeMultiplier = 1) {
    const dx = survivor.x - hunter.x;
    const dy = survivor.y - hunter.y;
    const distance = Math.hypot(dx, dy);
    if (distance > hunter.attackRange * rangeMultiplier + survivor.radius * 0.5) return false;
    const targetAngle = Math.atan2(dy, dx);
    return Math.abs(angleDifference(hunter.angle, targetAngle)) <= hunter.attackArc / 2;
  }

  function angleDifference(a, b) {
    return Math.atan2(Math.sin(b - a), Math.cos(b - a));
  }

  function turnToward(current, target, maxStep) {
    const diff = angleDifference(current, target);
    if (Math.abs(diff) <= maxStep) return target;
    return current + Math.sign(diff) * maxStep;
  }

  function dropPallet(actor, pallet, now) {
    if (isShieldBearerGuarding(actor, now)) return false;
    if (!actor || actor.action || !pallet || pallet.label !== "standing") return false;
    actor.action = {
      kind: "droppingPallet",
      start: now,
      until: now + SURVIVOR_PALLET_DROP_DURATION * (isShieldBearer(actor) ? SHIELD_BEARER_PALLET_DURATION_MULTIPLIER : 1) / getSurvivorInteractionSpeedMultiplier(actor),
      pallet
    };
    actor.vx = 0;
    actor.vy = 0;
    return true;
  }

  function finishDropPallet(actor, pallet, now) {
    pallet.label = "dropped";
    invalidateCollisionRects();
    chasePulseUntil = now + 320;
    const projectionHits = abyssProjections.filter((projection) => distanceBetween(projection, pallet) < 92);
    projectionHits.forEach((projection) => {
      projection.palletStunnedUntil = Math.max(projection.palletStunnedUntil || 0, now + 3000);
    });
    if (projectionHits.length > 0 && selectedRole !== PLAYER_ROLE.hunter) showAssistAlert(`砸中投影 ${projectionHits.length}`, now, 850);
    if (distanceBetween(hunter, pallet) < 92 && now >= hunter.stunnedUntil) {
      const stunBefore = hunter.stunnedUntil || 0;
      interruptHunterByStun(now, 3000);
      if ((hunter.stunnedUntil || 0) > stunBefore) trackFighterPalletStunUnlock(actor);
    }
  }

  function startBreakPallet(pallet, now) {
    if (hunter.action || hunter.status === "stunned") return;
    hunter.status = "breaking";
    hunter.action = {
      kind: "breaking",
      start: now,
      until: now + 1550,
      pallet
    };
  }

  function startVault(actor, obstacle, duration, now, kind) {
    if (actor.action) return;
    if (actor !== hunter && now < (actor.hammerVaultLockedUntil || 0)) return;
    if (obstacle.label === "window" && isWindowBlockedForActor(obstacle, actor, now)) return;
    const normal = getObstacleNormal(obstacle);
    const side = Math.sign((actor.x - obstacle.x) * normal.x + (actor.y - obstacle.y) * normal.y) || 1;
    const destination = findVaultDestination(actor, obstacle, normal, side);

    actor.action = {
      kind,
      start: now,
      until: now + duration,
      fromX: actor.x,
      fromY: actor.y,
      toX: destination.x,
      toY: destination.y,
      obstacleLabel: obstacle.label,
      obstacle,
      aiRouteNextAnchor: actor.kind === "ai" && actor.kiteDecision && actor.kiteDecision.anchor === obstacle ? actor.kiteDecision.nextAnchor : null
    };
  }

  function isWindowBlockedForActor(windowItem, actor, now = performance.now()) {
    return Boolean(windowItem && windowItem.label === "window" && actor !== hunter && now < (windowItem.blockedUntil || 0));
  }

  function maybeTriggerConfinedSpace(actor, action, now) {
    if (actor !== hunter || !hasHunterBadge("confinedSpace") || !action || action.obstacleLabel !== "window" || !action.obstacle) return;
    action.obstacle.blockedUntil = Math.max(action.obstacle.blockedUntil || 0, now + CONFINED_SPACE_WINDOW_BLOCK_DURATION);
    showAssistAlert("禁闭空间", now, 900);
  }

  function maybeTriggerKneeJerk(actor, action, now) {
    if (!actor || actor === hunter || !hasSurvivorBadge(actor, "kneeJerk")) return;
    if (!action || action.kind !== "vaulting") return;
    const isWindow = action.obstacleLabel === "window";
    const cooldownKey = isWindow ? "nextKneeJerkWindowAt" : "nextKneeJerkPalletAt";
    if (now < (actor[cooldownKey] || 0)) return;
    actor.kneeJerkBoostUntil = now + KNEE_JERK_DURATION;
    actor[cooldownKey] = now + KNEE_JERK_COOLDOWN;
    if (actor === player) showAssistAlert(isWindow ? "膝跳反射 窗" : "膝跳反射 板", now, 850);
  }

  function findVaultDestination(actor, obstacle, normal, side) {
    const radius = actor.radius;
    const tangent = { x: -normal.y, y: normal.x };
    const distances = obstacle.label === "window"
      ? [86, 104, 124, 146, 170]
      : [74, 88, 104, 122];
    const tangentOffsets = [0, 18, -18, 34, -34, 52, -52];

    for (const distance of distances) {
      for (const offset of tangentOffsets) {
        const x = obstacle.x - normal.x * side * distance + tangent.x * offset;
        const y = obstacle.y - normal.y * side * distance + tangent.y * offset;
        if (isSafePosition(x, y, radius)) return { x, y };
      }
    }

    return findNearestSafePosition(
      obstacle.x - normal.x * side * distances[distances.length - 1],
      obstacle.y - normal.y * side * distances[distances.length - 1],
      radius
    );
  }

  function isSafePosition(x, y, radius) {
    if (x < 70 || y < 70 || x > world.width - 70 || y > world.height - 70) return false;
    return !collides(x, y, radius);
  }

  function findNearestSafePosition(x, y, radius) {
    if (isSafePosition(x, y, radius)) return { x, y };

    for (let ring = 1; ring <= 8; ring += 1) {
      const distance = ring * 24;
      for (let step = 0; step < 16; step += 1) {
        const angle = (Math.PI * 2 * step) / 16;
        const candidateX = x + Math.cos(angle) * distance;
        const candidateY = y + Math.sin(angle) * distance;
        if (isSafePosition(candidateX, candidateY, radius)) {
          return { x: candidateX, y: candidateY };
        }
      }
    }

    return { x: actorClamp(x, 80, world.width - 80), y: actorClamp(y, 80, world.height - 80) };
  }

  function actorClamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function updateFencerLungeAction(actor, action, now) {
    if (!isFencer(actor) || actor.state !== "healthy" && actor.state !== "injured" || actor.escaped) {
      actor.action = null;
      return true;
    }

    const dt = Math.max(0, (now - (action.lastUpdate || action.start)) / 1000);
    action.lastUpdate = now;
    const speed = FENCER_LUNGE_DISTANCE / (FENCER_LUNGE_DURATION / 1000);
    const remaining = Math.max(0, FENCER_LUNGE_DISTANCE - (action.distance || 0));
    const step = Math.min(speed * dt, remaining);
    const beforeX = actor.x;
    const beforeY = actor.y;
    const moved = moveActorSmart(actor, Math.cos(action.angle) * step, Math.sin(action.angle) * step);
    action.distance = (action.distance || 0) + moved;
    actor.angle = action.angle;
    actor.vx = (actor.x - beforeX) / Math.max(dt, 0.001);
    actor.vy = (actor.y - beforeY) / Math.max(dt, 0.001);

    if (!action.hitHunter && distanceBetween(actor, hunter) <= actor.radius + hunter.radius + 18) {
      interruptHunterByStun(now, FENCER_LUNGE_HUNTER_STUN);
      action.hitHunter = true;
      showAssistAlert("突刺命中", now, 650);
    }

    if (now >= action.until || action.distance >= FENCER_LUNGE_DISTANCE - 0.5 || moved < 0.01 && step > 0.5) {
      finishFencerLunge(actor, action, now);
    }
    return true;
  }

  function updateFighterPunchAction(actor, action, now) {
    if (!isFighter(actor) || actor.state !== "healthy" && actor.state !== "injured" || actor.escaped) {
      actor.action = null;
      return true;
    }
    actor.vx = 0;
    actor.vy = 0;
    actor.angle = action.angle;
    if (!action.resolved && now >= action.hitAt) {
      action.resolved = true;
      const dx = hunter.x - actor.x;
      const dy = hunter.y - actor.y;
      const distance = Math.hypot(dx, dy);
      const inRange = distance <= getFighterPunchRange() + hunter.radius * 0.5;
      const inArc = Math.abs(angleDifference(Math.atan2(dy, dx), action.angle)) <= FIGHTER_PUNCH_ARC * 0.5;
      const hasLine = action.arena || hasWalkableLine(actor.x, actor.y, hunter.x, hunter.y, actor.radius);
      if (inRange && inArc && hasLine) {
        action.hitHunter = true;
        if (action.arena && isFighterArenaActive()) {
          fighterArena.hunterHealth = Math.max(0, fighterArena.hunterHealth - 1);
          action.until = now + FIGHTER_ARENA_PUNCH_WIPE;
          showAssistAlert(`擂台重拳 · 追捕者${fighterArena.hunterHealth}/${FIGHTER_ARENA_HUNTER_HEALTH}血`, now, 900);
          if (fighterArena.hunterHealth <= 0) finishFighterArena("hunterDefeated", now);
        } else {
          actor.nextFighterPunchAt = now + FIGHTER_PUNCH_HIT_COOLDOWN;
          const stunBefore = hunter.stunnedUntil || 0;
          const rescued = interruptHunterByStun(now, FIGHTER_PUNCH_STUN);
          if ((hunter.stunnedUntil || 0) > stunBefore) actor.fighterPunchStunCount = Math.min(FIGHTER_PUNCH_STUNS_FOR_ARENA, (actor.fighterPunchStunCount || 0) + 1);
          showAssistAlert(rescued ? "破缚救援" : "破缚拳命中", now, 900);
        }
      } else {
        if (!action.arena) actor.nextFighterPunchAt = now + FIGHTER_PUNCH_MISS_COOLDOWN;
        showAssistAlert("破缚拳落空", now, 650);
      }
    }
    if (now >= action.until) actor.action = null;
    return true;
  }

  function updateAntiqueFluteStrikeAction(actor, action, now) {
    if (!isAntiqueDealer(actor) || actor.state !== "healthy" && actor.state !== "injured" || actor.escaped) {
      actor.action = null;
      return true;
    }
    actor.vx = 0;
    actor.vy = 0;
    if (!action.hitHunter && now >= action.hitAt) {
      action.hitHunter = true;
      const knockbackAngle = action.key === 2 ? action.angle : action.angle + action.swingDirection * Math.PI / 2;
      if (isHunterHitByAntiqueStrike(actor, action)) knockbackHunterFromAntiqueStrike(actor, knockbackAngle, now, action.swingDirection);
    }
    if (now >= action.until) actor.action = null;
    return true;
  }

  function updateAntiqueLeapAction(actor, action, now) {
    if (!isAntiqueDealer(actor) || actor.state !== "healthy" && actor.state !== "injured" || actor.escaped) {
      actor.action = null;
      return true;
    }
    const progress = Math.min(1, Math.max(0, (now - action.start) / ANTIQUE_LEAP_DURATION));
    const previousX = actor.x;
    const previousY = actor.y;
    const elapsed = Math.max(1 / 60, (now - (action.lastUpdate || action.start)) / 1000);
    actor.x = action.fromX + (action.toX - action.fromX) * progress;
    actor.y = action.fromY + (action.toY - action.fromY) * progress;
    actor.angle = action.angle;
    actor.vx = (actor.x - previousX) / elapsed;
    actor.vy = (actor.y - previousY) / elapsed;
    action.lastUpdate = now;
    if (progress >= 1) {
      actor.vx = 0;
      actor.vy = 0;
      actor.action = null;
    }
    return true;
  }

  function updateFlywheelAction(actor, action, now) {
    if (!hasSurvivorBadge(actor, "flywheel") || actor.state !== "healthy" && actor.state !== "injured" || actor.escaped) {
      actor.action = null;
      return true;
    }

    const dt = Math.max(0, (now - (action.lastUpdate || action.start)) / 1000);
    action.lastUpdate = now;
    const injuryMultiplier = actor.state === "injured" ? 0.88 : 1;
    const speed = actor.speed * injuryMultiplier * getSurvivorMoveSpeedMultiplier(actor, now) * FLYWHEEL_SPEED_MULTIPLIER;
    const step = speed * dt;
    const beforeX = actor.x;
    const beforeY = actor.y;
    const moved = moveActorSmart(actor, Math.cos(action.angle) * step, Math.sin(action.angle) * step);
    action.distance = (action.distance || 0) + moved;
    actor.angle = action.angle;
    actor.vx = (actor.x - beforeX) / Math.max(dt, 0.001);
    actor.vy = (actor.y - beforeY) / Math.max(dt, 0.001);

    if (now >= action.until || moved < 0.01 && step > 0.5) {
      actor.vx = 0;
      actor.vy = 0;
      actor.action = null;
    }
    return true;
  }

  function updatePackageRecoilAction(actor, action, now) {
    if (!isMessenger(actor) || actor.state !== "healthy" && actor.state !== "injured" || actor.escaped) {
      actor.action = null;
      return true;
    }

    const dt = Math.max(0, (now - (action.lastUpdate || action.start)) / 1000);
    action.lastUpdate = now;
    const speed = PACKAGE_RECOIL_DISTANCE / Math.max(PACKAGE_RECOIL_DURATION / 1000, 0.001);
    const remaining = Math.max(0, PACKAGE_RECOIL_DISTANCE - (action.distance || 0));
    const step = Math.min(speed * dt, remaining);
    const beforeX = actor.x;
    const beforeY = actor.y;
    const moved = moveActorSmart(actor, Math.cos(action.moveAngle) * step, Math.sin(action.moveAngle) * step);
    action.distance = (action.distance || 0) + moved;
    actor.angle = action.faceAngle;
    actor.vx = (actor.x - beforeX) / Math.max(dt, 0.001);
    actor.vy = (actor.y - beforeY) / Math.max(dt, 0.001);

    if (now >= action.until || action.distance >= PACKAGE_RECOIL_DISTANCE - 0.5 || moved < 0.01 && step > 0.5) {
      actor.vx = 0;
      actor.vy = 0;
      actor.action = null;
    }
    return true;
  }

  function updateGeneralRamAction(actor, action, now) {
    if (!isGeneral(actor) || !isGeneralRiding(actor, now) || actor.state !== "healthy" && actor.state !== "injured" || actor.escaped) {
      finishGeneralRam(actor);
      return true;
    }

    const dt = Math.max(0, (now - (action.lastUpdate || action.start)) / 1000);
    action.lastUpdate = now;
    const phaseElapsed = now - action.start;
    const isBackstep = phaseElapsed < GENERAL_RAM_WINDUP;
    const speed = isBackstep
      ? GENERAL_RAM_BACKSTEP_DISTANCE / Math.max(GENERAL_RAM_WINDUP / 1000, 0.001)
      : GENERAL_RAM_DISTANCE / Math.max(GENERAL_RAM_DURATION / 1000, 0.001);
    const maxDistance = isBackstep ? GENERAL_RAM_BACKSTEP_DISTANCE : GENERAL_RAM_DISTANCE;
    const key = isBackstep ? "backstepDistance" : "dashDistance";
    const direction = isBackstep ? action.angle + Math.PI : action.angle;
    const remaining = Math.max(0, maxDistance - (action[key] || 0));
    const step = Math.min(speed * dt, remaining);
    const beforeX = actor.x;
    const beforeY = actor.y;
    const moved = moveActorSmart(actor, Math.cos(direction) * step, Math.sin(direction) * step);

    action[key] = (action[key] || 0) + moved;
    actor.angle = action.angle;
    actor.vx = (actor.x - beforeX) / Math.max(dt, 0.001);
    actor.vy = (actor.y - beforeY) / Math.max(dt, 0.001);

    if (isBackstep && phaseElapsed + dt * 1000 >= GENERAL_RAM_WINDUP) {
      action.phase = "dash";
      showAssistAlert("铁骑冲刺", now, 620);
    }

    if (!isBackstep && !action.hitHunter && distanceBetween(actor, hunter) <= GENERAL_RAM_HIT_RANGE) {
      action.hitHunter = true;
      ramHunterFromGeneral(actor, now);
      finishGeneralRam(actor);
      return true;
    }

    if (now >= action.until || !isBackstep && (action.dashDistance >= GENERAL_RAM_DISTANCE - 0.5 || moved < 0.01 && step > 0.5)) {
      finishGeneralRam(actor);
    }
    return true;
  }

  function updateHunterAttackWindupAction(action, now) {
    hunter.status = "attacking";
    hunter.angle = action.angle;
    if (now < hunter.stunnedUntil || now < hunter.wipeUntil) {
      hunter.action = null;
      hunter.vx = 0;
      hunter.vy = 0;
      return true;
    }

    if (action.charging) {
      const dt = Math.max(0, (now - (action.lastUpdate || action.start)) / 1000);
      action.lastUpdate = now;
      const move = selectedRole === PLAYER_ROLE.hunter ? getMoveVector() : { x: 0, y: 0, length: 0 };
      const speed = getHunterMoveSpeed() * getHunterCarrySpeedMultiplier() * CHARGED_ATTACK_MOVE_MULTIPLIER;
      const beforeX = hunter.x;
      const beforeY = hunter.y;
      if (move.length > 0.1) hunter.angle = Math.atan2(move.y, move.x);
      action.angle = hunter.angle || action.angle;
      moveActor(hunter, move.x * speed * dt, move.y * speed * dt);
      hunter.vx = (hunter.x - beforeX) / Math.max(dt, 0.001);
      hunter.vy = (hunter.y - beforeY) / Math.max(dt, 0.001);
      if (now - action.start >= CHARGED_ATTACK_MAX_HOLD) {
        finishChargedHunterAttack(action, now, CHARGED_ATTACK_MAX_HOLD);
      }
      return true;
    }

    const motionStart = action.releaseStart || action.start;
    const duration = Math.max(1, action.until - motionStart);
    const dt = Math.max(0, (now - (action.lastUpdate || motionStart)) / 1000);
    action.lastUpdate = now;
    const lungeDistance = action.lungeDistance || 0;
    const remaining = Math.max(0, lungeDistance - (action.distance || 0));
    const step = Math.min((lungeDistance / (duration / 1000)) * dt, remaining);
    const beforeX = hunter.x;
    const beforeY = hunter.y;
    const moved = step > 0 ? moveActorSmart(hunter, Math.cos(action.angle) * step, Math.sin(action.angle) * step) : 0;
    action.distance = (action.distance || 0) + moved;
    hunter.vx = (hunter.x - beforeX) / Math.max(dt, 0.001);
    hunter.vy = (hunter.y - beforeY) / Math.max(dt, 0.001);

    if (now >= action.until) {
      commitHunterAttack(now);
      resolveHunterAttack(action, now);
    }
    return true;
  }

  function finishFencerLunge(actor, action, now) {
    actor.vx = 0;
    actor.vy = 0;
    actor.action = null;
    const obstacle = findFencerAutoVaultObstacle(actor, action.angle);
    if (obstacle) {
      startVault(actor, obstacle, getSurvivorVaultDuration(actor, obstacle.label === "window" ? 320 : 260), now, "vaulting");
    }
  }

  function findFencerAutoVaultObstacle(actor, angle) {
    const forward = { x: Math.cos(angle), y: Math.sin(angle) };
    let best = null;
    let bestScore = Infinity;
    windows.concat(pallets.filter((pallet) => pallet.label === "dropped")).forEach((obstacle) => {
      const dx = obstacle.x - actor.x;
      const dy = obstacle.y - actor.y;
      const distance = distanceToProp(actor, obstacle);
      if (distance > 118) return;
      const length = Math.hypot(dx, dy);
      if (length < 0.001) return;
      const alignment = (dx / length) * forward.x + (dy / length) * forward.y;
      if (alignment < 0.35) return;
      const score = distance - alignment * 24;
      if (score < bestScore) {
        best = obstacle;
        bestScore = score;
      }
    });
    return best;
  }

  function updateActorAction(actor, now) {
    if (!actor.action) return false;

    const action = actor.action;
    if (actor === hunter && (action.kind === "hammerCharge" || action.kind === "hammerLeap")) {
      return updateHammerAction(action, now);
    }

    if (action.kind === "sawDash") {
      return updateSawDashAction(action, now);
    }

    if (action.kind === "danceStep") {
      return updateDanceStepAction(action, now);
    }

    if (action.kind === "attackWindup") {
      if (actor !== hunter) {
        actor.action = null;
        return true;
      }
      return updateHunterAttackWindupAction(action, now);
    }

    if (action.kind === "abnormalAttack") {
      actor.vx = 0;
      actor.vy = 0;
      actor.status = "abnormal";
      if (now >= action.until) {
        finishAssistAbnormal(action, now);
        actor.action = null;
      }
      return true;
    }

    if (action.kind === "dismantlingChannel") {
      hunter.status = "dismantlingChannel";
      hunter.vx = 0;
      hunter.vy = 0;
      if (!navigationChannels.includes(action.channel) || distanceBetween(hunter, action.channel) > NAVIGATION_CHANNEL_DISMANTLE_RANGE + 18) {
        hunter.action = null;
        return true;
      }
      hunter.angle = Math.atan2(action.channel.y - hunter.y, action.channel.x - hunter.x);
      if (now >= action.until) {
        dismantleNavigationChannel(action.channel, now);
        hunter.action = null;
      }
      return true;
    }

    if (action.kind === "droppingPallet") {
      actor.vx = 0;
      actor.vy = 0;
      actor.angle = Math.atan2(action.pallet.y - actor.y, action.pallet.x - actor.x);
      if ((actor.state !== "healthy" && actor.state !== "injured") || action.pallet.label !== "standing") {
        actor.action = null;
        return true;
      }
      if (now >= action.until) {
        finishDropPallet(actor, action.pallet, now);
        actor.action = null;
      }
      return true;
    }

    if (action.kind === "fencerLunge") {
      return updateFencerLungeAction(actor, action, now);
    }

    if (action.kind === "fighterPunch") {
      return updateFighterPunchAction(actor, action, now);
    }

    if (action.kind === "antiqueFluteStrike") {
      return updateAntiqueFluteStrikeAction(actor, action, now);
    }

    if (action.kind === "antiqueLeap") {
      return updateAntiqueLeapAction(actor, action, now);
    }

    if (action.kind === "flywheelDash") {
      return updateFlywheelAction(actor, action, now);
    }

    if (action.kind === "navigationChannelSlide") {
      return updateNavigationChannelSlideAction(actor, action, now);
    }

    if (action.kind === "packageRecoil") {
      return updatePackageRecoilAction(actor, action, now);
    }

    if (action.kind === "generalRam") {
      return updateGeneralRamAction(actor, action, now);
    }

    if (action.kind === "pickingUp") {
      actor.vx = 0;
      actor.vy = 0;
      actor.status = "pickingUp";
      if (action.target) actor.angle = Math.atan2(action.target.y - actor.y, action.target.x - actor.x);
      if (
        actor !== hunter ||
        hunter.carrying ||
        !action.target ||
        action.target.state !== "downed" ||
        distanceBetween(actor, action.target) > 126
      ) {
        cancelPickupAction(action);
        actor.action = null;
        return true;
      }
      if (now < hunter.stunnedUntil) {
        cancelPickupAction(action, now, true);
        actor.action = null;
        return true;
      }
      if (now >= action.until) {
        finishPickupSurvivor(action.target);
        actor.action = null;
      }
      return true;
    }

    if (action.kind === "healing") {
      if (cancelHealingDuringCarry(actor)) return true;
      actor.vx = 0;
      actor.vy = 0;
      actor.angle = Math.atan2(action.target.y - actor.y, action.target.x - actor.x);
      if (actor.kind === "ai" && (hunter.target === actor || !canAIHealTarget(action.target, actor))) {
        cancelHealing(action);
        actor.action = null;
        actor.healDecision = null;
        return true;
      }
      if (!isHealableState(action.target) || action.target.escaped || distanceBetween(actor, action.target) > 112) {
        cancelHealing(action);
        actor.action = null;
        return true;
      }
      if (!action.target.action) {
        action.target.action = {
          kind: "beingHealed",
          start: action.start,
          target: action.target
        };
      } else if (action.target.action.kind !== "beingHealed") {
        cancelHealing(action);
        actor.action = null;
        return true;
      }
      return true;
    }

    if (action.kind === "selfHealing") {
      if (cancelHealingDuringCarry(actor)) return true;
      actor.vx = 0;
      actor.vy = 0;
      if (actor.state !== "downed" || actor.escaped || isBeingPickedUp(actor)) {
        actor.action = null;
        return true;
      }
      const elapsed = Math.max(0, now - (action.lastUpdate || now));
      action.lastUpdate = now;
      const selfHealLimit = actor.selfHealUsed ? SELF_HEAL_CAP : 1;
      actor.healProgress = Math.min(selfHealLimit, (actor.healProgress || 0) + (elapsed * getSurvivorHealPower(actor)) / SELF_HEAL_DOWNED_DURATION);
      if (!actor.selfHealUsed && actor.healProgress >= 1) {
        actor.selfHealUsed = true;
        finishHealing(actor);
      } else if (actor.selfHealUsed && actor.healProgress >= SELF_HEAL_CAP) {
        actor.action = null;
      }
      return true;
    }

    if (action.kind === "rescuing") {
      actor.vx = 0;
      actor.vy = 0;
      actor.angle = Math.atan2(action.target.y - actor.y, action.target.x - actor.x);
      if (action.target.state !== "seated" || !action.target.chair || distanceBetween(actor, action.target.chair) > 112) {
        actor.action = null;
        return true;
      }
      if (now >= action.until) {
        finishRescue(action);
        actor.action = null;
      }
      return true;
    }

    if (action.kind === "dismantlingLamp") {
      actor.vx = 0;
      actor.vy = 0;
      actor.angle = Math.atan2(action.lamp.y - actor.y, action.lamp.x - actor.x);
      if (!soulLamps.includes(action.lamp) || actor.state !== "healthy" && actor.state !== "injured" || distanceBetween(actor, action.lamp) > SOUL_LAMP_DISMANTLE_RANGE + 18) {
        actor.action = null;
        return true;
      }
      if (now >= action.until) {
        finishDismantleSoulLamp(action);
        actor.action = null;
      }
      return true;
    }

    if (action.kind === "dismantlingSoulPatrol") {
      actor.vx = 0;
      actor.vy = 0;
      actor.angle = Math.atan2(action.point.y - actor.y, action.point.x - actor.x);
      if (!isSoulPatrolPoint(action.point) || actor.state !== "healthy" && actor.state !== "injured" || distanceBetween(actor, action.point) > SOUL_PATROL_DISMANTLE_RANGE + 18) {
        actor.action = null;
        return true;
      }
      if (now >= action.until) {
        finishDismantleSoulPatrol(action, now);
        actor.action = null;
      }
      return true;
    }

    if (action.kind === "dismantlingPeeper") {
      actor.vx = 0;
      actor.vy = 0;
      actor.angle = Math.atan2(action.ward.y - actor.y, action.ward.x - actor.x);
      if (!assistPeeperWards.includes(action.ward) || actor.state !== "healthy" && actor.state !== "injured" || distanceBetween(actor, action.ward) > ASSIST_PEEPER_DISMANTLE_RANGE + 18) {
        actor.action = null;
        return true;
      }
      if (now >= action.until) {
        finishDismantlePeeperWard(action, now);
        actor.action = null;
      }
      return true;
    }

    if (action.kind === "beingHealed") {
      if (cancelHealingDuringCarry(actor)) return true;
      actor.vx = 0;
      actor.vy = 0;
      if (!isHealableState(actor) || getActiveHealers(actor).length === 0) {
        actor.action = null;
      }
      return true;
    }

    if (action.kind === "repairing") {
      actor.vx = 0;
      actor.vy = 0;
      actor.angle = Math.atan2(action.point.y - actor.y, action.point.x - actor.x);
      if (actor.state === "downed" || actor.escaped || action.point.completed || distanceBetween(actor, action.point) > 130) {
        cancelRepair(action);
        actor.action = null;
        return true;
      }
      updateSoulNoise(action, now);
      updateRepairCalibration(action, now);
      return true;
    }

    if (action.kind === "repairStun") {
      actor.vx = 0;
      actor.vy = 0;
      if (now >= action.until || actor.state === "downed" || actor.escaped) actor.action = null;
      return true;
    }

    if (action.kind === "openingGate") {
      actor.vx = 0;
      actor.vy = 0;
      actor.angle = Math.atan2(action.gate.y - actor.y, action.gate.x - actor.x);
      if (actor.kind === "ai" && !action.gate.opened && exitGates.some((gate) => gate.opened)) {
        cancelGateOpen(action);
        actor.action = null;
        actor.objectiveDecision = null;
        return true;
      }
      if (!areExitsPowered() || action.gate.opened || actor.state === "downed" || actor.escaped || !isActorInGateUseRange(actor, action.gate)) {
        cancelGateOpen(action);
        actor.action = null;
        return true;
      }
      const elapsed = Math.max(0, now - (action.lastUpdate || action.start || now));
      action.lastUpdate = now;
      const antiqueGateMultiplier = isAntiqueDealer(actor) ? 0.5 : 1;
      action.gate.progress = Math.min(1, action.gate.progress + (elapsed / action.duration) * getSurvivorInteractionSpeedMultiplier(actor) * antiqueGateMultiplier);
      if (action.gate.progress >= 1) finishOpenGate(action.gate);
      return true;
    }

    if (action.kind === "escaping") {
      const escapeTarget = action.gate || action.hatch;
      const isHatchEscape = Boolean(action.hatch);
      actor.vx = 0;
      actor.vy = 0;
      actor.angle = Math.atan2(escapeTarget.y - actor.y, escapeTarget.x - actor.x);
      if (
        !escapeTarget ||
        actor.escaped ||
        (isHatchEscape ? !isHatchOpen() : !areExitsPowered()) ||
        (isHatchEscape ? distanceBetween(actor, escapeTarget) > 120 : !isActorInGateUseRange(actor, escapeTarget, getAIGateEscapePoint(actor, escapeTarget)))
      ) {
        actor.action = null;
        return true;
      }
      if (now >= action.until) finishEscape(actor);
      return true;
    }

    if (action.kind === "breaking") {
      hunter.status = "breaking";
      if (now >= action.until) {
        action.pallet.label = "broken";
        invalidateCollisionRects();
        actor.action = null;
      }
      return true;
    }

    const progress = Math.min(1, (now - action.start) / Math.max(action.until - action.start, 1));
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    actor.x = action.fromX + (action.toX - action.fromX) * eased;
    actor.y = action.fromY + (action.toY - action.fromY) * eased;
    actor.angle = Math.atan2(action.toY - action.fromY, action.toX - action.fromX);

    if (actor === hunter) hunter.status = "vaulting";
    if (now >= action.until) {
      maybeTriggerKneeJerk(actor, action, now);
      maybeTriggerConfinedSpace(actor, action, now);
      if (actor.kind === "ai" && action.aiRouteNextAnchor && action.aiRouteNextAnchor.label !== "broken") {
        const away = normalizeVector(actor.x - hunter.x, actor.y - hunter.y);
        actor.kiteDecision = createKiteDecision(actor, action.aiRouteNextAnchor, "rotate", away, now);
      }
      actor.action = null;
    }
    return true;
  }

  function findNearestPallet(actor, state, range) {
    let nearest = null;
    let nearestDistance = Infinity;
    pallets.forEach((pallet) => {
      if (pallet.label !== state) return;
      const distance = distanceToProp(actor, pallet);
      if (distance < range && distance < nearestDistance) {
        nearest = pallet;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function findNearestWindow(actor, range) {
    let nearest = null;
    let nearestDistance = Infinity;
    windows.forEach((item) => {
      if (isWindowBlockedForActor(item, actor)) return;
      const distance = distanceToProp(actor, item);
      if (distance < range && distance < nearestDistance) {
        nearest = item;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function distanceBetween(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function distanceToProp(actor, item) {
    const halfW = item.w / 2;
    const halfH = item.h / 2;
    const closestX = Math.max(item.x - halfW, Math.min(actor.x, item.x + halfW));
    const closestY = Math.max(item.y - halfH, Math.min(actor.y, item.y + halfH));
    return Math.max(0, Math.hypot(actor.x - closestX, actor.y - closestY) - actor.radius);
  }

  function pickWanderTarget() {
    const anchors = getKiteSpawnAnchors();
    for (let attempt = 0; attempt < 18; attempt += 1) {
      const picked = anchors[Math.floor(Math.random() * anchors.length)];
      const target = pickSpawnNearKiteAnchor(picked, [], 0, 24);
      if (isSafePosition(target.x, target.y, 24)) return target;
    }

    for (let attempt = 0; attempt < 30; attempt += 1) {
      const x = 110 + Math.random() * (world.width - 220);
      const y = 110 + Math.random() * (world.height - 220);
      if (isSafePosition(x, y, 24)) return { x, y };
    }

    return { x: world.width / 2, y: world.height / 2 };
  }

  function getObstacleNormal(item) {
    if (Math.abs(item.angle - Math.PI / 2) < 0.1) return { x: 1, y: 0 };
    if (item.w > item.h) return { x: 0, y: 1 };
    return { x: 1, y: 0 };
  }

  function updateCamera(dt) {
    const target = getCameraTarget();
    const targetX = target.x - width / 2 / camera.zoom;
    const targetY = target.y - height / 2 / camera.zoom;
    const maxX = world.width - width / camera.zoom;
    const maxY = world.height - height / camera.zoom;
    const clampedX = Math.max(0, Math.min(targetX, Math.max(0, maxX)));
    const clampedY = Math.max(0, Math.min(targetY, Math.max(0, maxY)));
    const smoothing = 1 - Math.pow(0.001, dt);
    camera.x += (clampedX - camera.x) * smoothing;
    camera.y += (clampedY - camera.y) * smoothing;
  }

  function getCameraTarget() {
    if (selectedRole === PLAYER_ROLE.hunter && activePatroller) return activePatroller;
    if (selectedRole === PLAYER_ROLE.hunter) return hunter;
    if (player.escaped) {
      return teammates.find((survivor) => !survivor.escaped && survivor.state !== "downed") ||
        teammates.find((survivor) => !survivor.escaped) ||
        hunter;
    }
    return player;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-camera.x, -camera.y);

    drawGround();
    drawPerfumeMists();
    drawObjectives();
    drawSoulLamps();
    drawEdictTraps();
    drawHunterAssistObjects();
    drawTwinShadowZones();
    drawStitchPackDrops();
    drawTimeDevices();
    drawActorDecoys();
    drawMirrorRifts();
    drawMirrorCurtains();
    drawDancePoints();
    drawDanceLines();
    drawTunerEchoLines();
    drawNavigationChannels();
    drawRects(walls, "#141b16", "#293529");
    drawWindows();
    drawPallets();
    drawPackageAim();
    drawEdictHookAim();
    drawAbyssTentacleAim();
    drawNavigationChannelAim();
    drawActorRescuePhantomAim();
    drawMirrorCurtainAim();
    drawDancePointAim();
    drawTwinAim();
    drawBlinkAim();
    drawShiftAim();
    drawTwinSwordProjectiles();
    drawPackageProjectiles();
    drawGhostfireProjectiles();
    drawEdictHooks();
    drawAbyssTentacles();
    drawAbyssProjections();
    drawHammerShockEffects();
    drawHuntingHounds();
    drawPerfumerSenseAuras();
    drawAssistListenDirectionArrows();
    drawAbyssSenseArrows();
    drawPeeperDirectionArrows();
    drawWantedDirectionArrow();
    drawFighterArena();
    drawHunter();
    drawTeammates();
    drawPlayer();
    drawAntiqueCombatEffects();
    drawHunterRedLight();
    drawPerfumeMistOcclusion();
    drawHeartbeatIndicators();

    ctx.restore();
    drawPerfumeVisionOverlay();
    drawMirrorBlindOverlay();
    drawHunterTinnitusIndicator();
    drawMatchResult();
    drawLanternAlert();
    drawRepairCalibration();
    updateReadouts();
  }

  function drawFighterArena() {
    if (!isFighterArenaActive()) return;
    const now = performance.now();
    const pulse = 0.72 + Math.sin(now / 150) * 0.12;
    ctx.save();
    ctx.translate(fighterArena.x, fighterArena.y);
    const fill = ctx.createRadialGradient(0, 0, 18, 0, 0, fighterArena.radius);
    fill.addColorStop(0, "rgba(77, 51, 36, 0.985)");
    fill.addColorStop(0.72, "rgba(60, 35, 28, 0.985)");
    fill.addColorStop(1, "rgba(39, 21, 20, 0.99)");
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(0, 0, fighterArena.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(255, 210, 102, ${pulse})`;
    ctx.lineWidth = 5;
    ctx.setLineDash([12, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, fighterArena.radius - 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(255, 234, 174, 0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, fighterArena.radius * 0.58, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 239, 194, 0.95)";
    ctx.font = "700 16px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const preparation = isFighterArenaPreparing(now) ? `准备 ${Math.ceil((fighterArena.prepareUntil - now) / 1000)} 秒 · ` : "";
    const remaining = Math.max(0, Math.ceil(((fighterArena.endsAt || now) - now) / 1000));
    ctx.fillText(`${preparation}擂台 ${remaining}秒 · 格斗家 ${fighterArena.fighterHealth}/${FIGHTER_ARENA_HUNTER_HEALTH} 血 · 追捕者 ${fighterArena.hunterHealth}/${FIGHTER_ARENA_HUNTER_HEALTH} 血`, 0, -fighterArena.radius - 20);
    ctx.restore();
  }

  function drawAntiqueCombatEffects() {
    const now = performance.now();
    const action = player.action;
    if (selectedRole === PLAYER_ROLE.survivor && action && action.kind === "antiqueFluteStrike") {
      const progress = getActionProgress(action, now);
      const alpha = Math.sin(Math.min(1, progress) * Math.PI) * 0.9;
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(action.angle);
      ctx.strokeStyle = action.key === 2 ? `rgba(255, 222, 122, ${alpha})` : `rgba(235, 191, 255, ${alpha})`;
      ctx.lineWidth = action.key === 2 ? 5 : 6;
      ctx.lineCap = "round";
      if (action.key === 2) {
        const length = action.range * Math.min(1, progress * 1.65);
        ctx.beginPath();
        ctx.moveTo(player.radius + 10, 0);
        ctx.lineTo(length, 0);
        ctx.stroke();
      } else {
        const start = action.swingDirection > 0 ? -action.arc * 0.5 : action.arc * 0.5;
        const end = action.swingDirection > 0 ? action.arc * 0.5 : -action.arc * 0.5;
        const current = start + (end - start) * Math.min(1, progress * 1.55);
        ctx.beginPath();
        ctx.arc(0, 0, action.range * 0.72, start, current, action.swingDirection < 0);
        ctx.stroke();
      }
      ctx.restore();
    }
    for (let index = antiqueEffects.length - 1; index >= 0; index -= 1) {
      if (now >= antiqueEffects[index].until) antiqueEffects.splice(index, 1);
    }
    antiqueEffects.forEach((effect) => {
      const life = Math.max(0, Math.min(1, (effect.until - now) / (effect.kind === "stopAttack" ? 1000 : effect.kind === "wall" ? 620 : 460)));
      ctx.save();
      ctx.translate(effect.x || hunter.x, effect.y || hunter.y);
      if (effect.kind === "hit") {
        const radius = 28 + (1 - life) * 48;
        ctx.strokeStyle = `rgba(255, 218, 110, ${life * 0.95})`;
        ctx.lineWidth = 4 * life + 1;
        ctx.beginPath();
        ctx.arc(0, 0, radius, effect.angle - 0.7, effect.angle + 0.7);
        ctx.stroke();
        ctx.strokeStyle = `rgba(255, 244, 196, ${life * 0.9})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(effect.angle) * 8, Math.sin(effect.angle) * 8);
        ctx.lineTo(Math.cos(effect.angle) * (radius + 20), Math.sin(effect.angle) * (radius + 20));
        ctx.stroke();
      } else if (effect.kind === "wall") {
        const radius = 18 + (1 - life) * 42;
        ctx.strokeStyle = `rgba(242, 133, 90, ${life * 0.94})`;
        ctx.lineWidth = 3.5;
        for (let spoke = 0; spoke < 8; spoke += 1) {
          const angle = effect.angle + Math.PI * 2 * spoke / 8;
          ctx.beginPath();
          ctx.moveTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
          ctx.stroke();
        }
      } else if (effect.kind === "stopAttack") {
        const radius = 34 + (1 - life) * 30;
        ctx.strokeStyle = `rgba(221, 122, 238, ${life * 0.9})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    });

    if (now >= (hunter.stopAttackUntil || 0)) return;
    const remaining = Math.max(0, hunter.stopAttackUntil - now);
    const pulse = 1 + Math.sin(now / 120) * 0.06;
    ctx.save();
    ctx.translate(hunter.x, hunter.y);
    ctx.scale(pulse, pulse);
    ctx.strokeStyle = "rgba(221, 122, 238, 0.92)";
    ctx.fillStyle = "rgba(86, 44, 105, 0.18)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, hunter.radius + 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 232, 255, 0.92)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-15, -15);
    ctx.lineTo(15, 15);
    ctx.moveTo(-15, 15);
    ctx.lineTo(15, -15);
    ctx.stroke();
    ctx.fillStyle = "#ffe9ff";
    ctx.font = "800 11px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`止戈 ${Math.ceil(remaining / 1000)}s`, 0, -hunter.radius - 29);
    ctx.restore();
  }

  function drawGround() {
    const hospital = currentMapLayout && currentMapLayout.theme === "hospital";
    ctx.fillStyle = hospital ? "#1d2727" : "#202b23";
    ctx.fillRect(0, 0, world.width, world.height);

    ctx.strokeStyle = hospital ? "rgba(210, 230, 225, 0.052)" : "rgba(238, 243, 237, 0.035)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= world.width; x += world.tile) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, world.height);
      ctx.stroke();
    }
    for (let y = 0; y <= world.height; y += world.tile) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(world.width, y);
      ctx.stroke();
    }

    ctx.fillStyle = hospital ? "rgba(176, 206, 194, 0.055)" : "rgba(217, 183, 106, 0.06)";
    ctx.fillRect(54, 54, world.width - 108, world.height - 108);

    if (hospital) {
      ctx.fillStyle = "rgba(232, 245, 238, 0.035)";
      for (let x = 120; x < world.width - 120; x += 320) {
        ctx.fillRect(x, 54, 24, world.height - 108);
      }
      ctx.fillStyle = "rgba(185, 95, 82, 0.13)";
      [
        { x: 610, y: 720, r: 52 },
        { x: 1430, y: 1030, r: 42 },
        { x: 1960, y: 540, r: 34 },
        { x: 450, y: 1420, r: 30 }
      ].forEach((stain) => {
        ctx.beginPath();
        ctx.ellipse(stain.x, stain.y, stain.r, stain.r * 0.48, 0.4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.strokeStyle = "rgba(95, 143, 130, 0.18)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(180, 880);
      ctx.lineTo(world.width - 180, 880);
      ctx.moveTo(1210, 160);
      ctx.lineTo(1210, world.height - 170);
      ctx.stroke();
    }
  }

  function drawPerfumeMists() {
    const now = performance.now();
    perfumeMists.forEach((mist) => {
      if (now >= mist.until) return;
      const progress = Math.max(0, Math.min(1, (mist.until - now) / (mist.kind === "ultimate" ? PERFUME_ULTIMATE_DURATION : PERFUME_MIST_DURATION)));
      const pulse = 1 + Math.sin(now / 260 + mist.id) * 0.035;
      ctx.save();
      ctx.translate(mist.x, mist.y);
      ctx.scale(pulse, pulse);
      const gradient = ctx.createRadialGradient(0, 0, mist.radius * 0.18, 0, 0, mist.radius);
      if (mist.kind === "ultimate") {
        gradient.addColorStop(0, `rgba(245, 252, 255, ${0.72 * progress})`);
        gradient.addColorStop(0.48, `rgba(226, 244, 255, ${0.58 * progress})`);
        gradient.addColorStop(0.88, `rgba(168, 220, 255, ${0.28 * progress})`);
        gradient.addColorStop(1, "rgba(168, 220, 255, 0)");
        ctx.strokeStyle = `rgba(156, 220, 255, ${0.55 * progress})`;
        ctx.lineWidth = 4;
      } else {
        gradient.addColorStop(0, `rgba(250, 253, 255, ${0.76 * progress})`);
        gradient.addColorStop(0.5, `rgba(238, 248, 255, ${0.62 * progress})`);
        gradient.addColorStop(0.88, `rgba(206, 235, 255, ${0.28 * progress})`);
        gradient.addColorStop(1, "rgba(206, 235, 255, 0)");
        ctx.strokeStyle = `rgba(240, 250, 255, ${0.7 * progress})`;
        ctx.lineWidth = 2.5;
      }
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, mist.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.setLineDash(mist.kind === "ultimate" ? [18, 10] : [10, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, mist.radius, 0, Math.PI * 2);
      ctx.stroke();
      for (let puff = 0; puff < 10; puff += 1) {
        const puffAngle = now / 900 + mist.id + puff * 2.17;
        const puffRadius = mist.radius * (0.18 + (puff % 5) * 0.14);
        const x = Math.cos(puffAngle) * puffRadius;
        const y = Math.sin(puffAngle * 0.8) * puffRadius;
        ctx.fillStyle = `rgba(255, 255, 255, ${(mist.kind === "ultimate" ? 0.18 : 0.22) * progress})`;
        ctx.beginPath();
        ctx.arc(x, y, mist.radius * (mist.kind === "ultimate" ? 0.18 : 0.16), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  function drawMirrorRifts() {
    const now = performance.now();
    mirrorRifts.forEach((rift) => {
      const age = now - rift.createdAt;
      const pulse = 1 + Math.sin(age / 180) * 0.08;
      ctx.save();
      ctx.translate(rift.x, rift.y);
      ctx.scale(pulse, pulse);

      const gradient = ctx.createRadialGradient(0, 0, 4, 0, 0, MIRROR_RIFT_RADIUS);
      gradient.addColorStop(0, "rgba(101, 201, 255, 0.34)");
      gradient.addColorStop(0.56, "rgba(38, 123, 255, 0.18)");
      gradient.addColorStop(1, "rgba(38, 123, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, MIRROR_RIFT_RADIUS, MIRROR_RIFT_RADIUS * 0.42, -0.18, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(101, 201, 255, 0.86)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-44, -5);
      ctx.lineTo(-24, 4);
      ctx.lineTo(-8, -3);
      ctx.lineTo(10, 5);
      ctx.lineTo(30, -4);
      ctx.lineTo(46, 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(227, 249, 255, 0.72)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-18, -13);
      ctx.lineTo(-7, -4);
      ctx.moveTo(18, 13);
      ctx.lineTo(30, 3);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawMirrorCurtains() {
    const now = performance.now();
    mirrorCurtains.forEach((curtain) => {
      const alpha = Math.min(1, Math.max(0.18, ((curtain.until || now) - now) / MIRROR_CURTAIN_DURATION));
      drawMirrorCurtainSegment(curtain.x1, curtain.y1, curtain.x2, curtain.y2, alpha);
    });
  }

  function drawDanceLines() {
    const now = performance.now();
    danceLines.forEach((line) => {
      const duration = DANCE_LINE_DURATION;
      const life = Math.max(0.16, Math.min(1, (line.until - now) / duration));
      ctx.save();
      ctx.globalAlpha *= life;
      ctx.lineCap = "round";
      ctx.shadowColor = "rgba(246, 116, 209, 0.78)";
      ctx.shadowBlur = 16;
      ctx.strokeStyle = "rgba(114, 45, 126, 0.42)";
      ctx.lineWidth = DANCE_LINE_THICKNESS + 14;
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255, 182, 232, 0.94)";
      ctx.lineWidth = DANCE_LINE_THICKNESS;
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawTunerEchoLines() {
    const now = performance.now();
    tunerEchoLines.forEach((line) => {
      const life = Math.max(0.16, Math.min(1, (line.until - now) / TUNER_ECHO_DURATION));
      ctx.save();
      ctx.globalAlpha *= life;
      ctx.lineCap = "round";
      ctx.shadowColor = "rgba(174, 116, 232, 0.86)";
      ctx.shadowBlur = 14;
      ctx.strokeStyle = "rgba(104, 68, 155, 0.4)";
      ctx.lineWidth = TUNER_ECHO_THICKNESS + 14;
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.setLineDash([10, 8]);
      ctx.strokeStyle = "rgba(236, 211, 255, 0.96)";
      ctx.lineWidth = TUNER_ECHO_THICKNESS;
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawDancePoint(point, now) {
    if (!point) return;
    const life = Math.max(0, Math.min(1, (point.until - now) / DANCE_POINT_DURATION));
    const pulse = 1 + Math.sin(now / 130) * 0.1;
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.scale(pulse, pulse);
    ctx.globalAlpha *= Math.max(0.3, life);
    ctx.fillStyle = "rgba(104, 37, 123, 0.42)";
    ctx.strokeStyle = "rgba(255, 188, 232, 0.94)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 234, 249, 0.94)";
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawDancePoints() {
    if (!pendingDancePoint && !pendingDanceLine) return;
    const now = performance.now();
    drawDancePoint(pendingDancePoint, now);
    if (pendingDanceLine) {
      drawDancePoint(pendingDanceLine.firstPoint, now);
      drawDancePoint(pendingDanceLine.secondPoint, now);
    }
  }

  function drawDancePointAim() {
    if (!dancePointAim || !isDancer()) return;
    const point = getDancePointPlacementFromTarget(dancePointAim.targetX, dancePointAim.targetY);
    ctx.save();
    ctx.setLineDash([10, 7]);
    ctx.strokeStyle = "rgba(255, 184, 229, 0.8)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(hunter.x, hunter.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(121, 43, 137, 0.28)";
    ctx.strokeStyle = "rgba(255, 198, 235, 0.96)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawMirrorCurtainAim() {
    if (!mirrorCurtainAim || !mirrorCurtainAim.start || !mirrorCurtainAim.current) return;
    drawMirrorCurtainSegment(mirrorCurtainAim.start.x, mirrorCurtainAim.start.y, mirrorCurtainAim.current.x, mirrorCurtainAim.current.y, 0.62);
  }

  function drawMirrorCurtainSegment(x1, y1, x2, y2, alpha = 1) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(101, 201, 255, 0.65)";
    ctx.shadowBlur = 18;
    ctx.strokeStyle = "rgba(52, 132, 255, 0.34)";
    ctx.lineWidth = MIRROR_CURTAIN_THICKNESS + 14;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(101, 201, 255, 0.92)";
    ctx.lineWidth = MIRROR_CURTAIN_THICKNESS;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(232, 250, 255, 0.78)";
    ctx.lineWidth = 2;
    ctx.setLineDash([18, 12]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function drawPerfumerSenseAuras() {
    if (isInfiniteSawboneMode()) return;
    const now = performance.now();
    getSurvivors().forEach((survivor) => {
      if (!isPerfumer(survivor) || survivor.escaped || survivor.state === "eliminated") return;
      const distance = distanceBetween(survivor, hunter);
      if (distance > PERFUMER_SENSE_FAR_RANGE) return;
      const near = distance <= PERFUMER_SENSE_NEAR_RANGE;
      const pulse = 1 + Math.sin(now / 180) * 0.04;
      const radius = (near ? 34 : 30) * pulse;
      ctx.save();
      ctx.translate(survivor.x, survivor.y);
      ctx.strokeStyle = near ? "rgba(54, 128, 255, 0.9)" : "rgba(159, 222, 255, 0.76)";
      ctx.fillStyle = near ? "rgba(54, 128, 255, 0.14)" : "rgba(159, 222, 255, 0.1)";
      ctx.lineWidth = near ? 4 : 3;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawPerfumeMistOcclusion() {
    const now = performance.now();
    perfumeMists.forEach((mist) => {
      if (now >= mist.until) return;
      const duration = mist.kind === "ultimate" ? PERFUME_ULTIMATE_DURATION : PERFUME_MIST_DURATION;
      const progress = Math.max(0, Math.min(1, (mist.until - now) / duration));
      const fadeIn = Math.min(1, (duration - (mist.until - now)) / 900);
      const alpha = progress * fadeIn;
      const pulse = 1 + Math.sin(now / 280 + mist.id) * 0.025;
      ctx.save();
      ctx.translate(mist.x, mist.y);
      ctx.scale(pulse, pulse);

      const gradient = ctx.createRadialGradient(0, 0, mist.radius * 0.06, 0, 0, mist.radius);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${0.82 * alpha})`);
      gradient.addColorStop(0.42, `rgba(250, 253, 255, ${0.72 * alpha})`);
      gradient.addColorStop(0.74, `rgba(238, 248, 255, ${0.48 * alpha})`);
      gradient.addColorStop(1, "rgba(238, 248, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, mist.radius, 0, Math.PI * 2);
      ctx.fill();

      for (let puff = 0; puff < 14; puff += 1) {
        const puffAngle = now / 760 + mist.id * 0.7 + puff * 1.73;
        const puffRadius = mist.radius * (0.12 + (puff % 7) * 0.11);
        const x = Math.cos(puffAngle) * puffRadius;
        const y = Math.sin(puffAngle * 0.86) * puffRadius;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.36 * alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, mist.radius * (mist.kind === "ultimate" ? 0.2 : 0.18), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  function drawPerfumeVisionOverlay() {
    if (selectedRole !== PLAYER_ROLE.hunter || !isHunterInPerfumeMist(performance.now())) return;
    const inner = Math.min(width, height) * 0.2;
    const outer = Math.max(width, height) * 0.43;
    const gradient = ctx.createRadialGradient(width / 2, height / 2, inner, width / 2, height / 2, outer);
    gradient.addColorStop(0, "rgba(5, 9, 16, 0)");
    gradient.addColorStop(0.42, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(0.58, "rgba(0, 0, 0, 0.96)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
    ctx.save();
    ctx.fillStyle = "rgba(250, 253, 255, 0.82)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  function drawMirrorBlindOverlay() {
    if (selectedRole !== PLAYER_ROLE.survivor || !(performance.now() < (player.mirrorBlindUntil || 0))) return;
    const remaining = Math.max(0, (player.mirrorBlindUntil || 0) - performance.now());
    const alpha = Math.min(0.82, remaining / MIRROR_LIGHT_BLIND_DURATION);
    ctx.save();
    ctx.fillStyle = `rgba(227, 249, 255, ${0.56 * alpha})`;
    ctx.fillRect(0, 0, width, height);
    const gradient = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.08, width / 2, height / 2, Math.max(width, height) * 0.56);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(0.45, `rgba(101, 201, 255, ${0.16 * alpha})`);
    gradient.addColorStop(1, `rgba(3, 12, 25, ${0.55 * alpha})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  function drawRects(items, fill, stroke) {
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 3;
    items.forEach((item) => {
      ctx.beginPath();
      ctx.roundRect(item.x, item.y, item.w, item.h, 8);
      ctx.fill();
      ctx.stroke();
    });
  }

  function drawObjectives() {
    chairs.forEach(drawChair);
    repairPoints.forEach(drawRepairPoint);
    exitGates.forEach(drawExitGate);
    drawHatch();
  }

  function drawDeviceImage(key, maxWidth, maxHeight, alpha = 1) {
    const image = DEVICE_IMAGES[key];
    if (!image || !image.complete || !image.naturalWidth || !image.naturalHeight) return false;
    const scale = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
    return true;
  }

  function drawChair(item) {
    const survivor = item.survivor;
    ctx.save();
    ctx.translate(item.x, item.y);
    const hasImage = drawDeviceImage("chair", 58, 88, item.destroyed ? 0.32 : survivor ? 1 : 0.88);
    if (hasImage) {
      if (item.destroyed) {
        ctx.strokeStyle = "rgba(185, 95, 82, 0.85)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-24, -30);
        ctx.lineTo(24, 30);
        ctx.moveTo(24, -30);
        ctx.lineTo(-24, 30);
        ctx.stroke();
      }
      if (survivor) {
        ctx.strokeStyle = "#eef3ed";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 35, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * survivor.chairProgress);
        ctx.stroke();

        ctx.strokeStyle = "rgba(238, 243, 237, 0.55)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 27, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    ctx.fillStyle = item.destroyed ? "rgba(70, 58, 52, 0.24)" : survivor ? "rgba(185, 95, 82, 0.28)" : "rgba(217, 183, 106, 0.14)";
    ctx.strokeStyle = item.destroyed ? "#5f5550" : survivor ? "#b95f52" : "#d9b76a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-18, -24, 36, 48, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = survivor ? "#f2cbc5" : "#fff0bc";
    ctx.fillRect(-10, -18, 20, 7);
    ctx.fillRect(-10, 12, 20, 7);
    ctx.fillRect(-3, -10, 6, 24);

    if (item.destroyed) {
      ctx.strokeStyle = "rgba(185, 95, 82, 0.85)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-18, -24);
      ctx.lineTo(18, 24);
      ctx.moveTo(18, -24);
      ctx.lineTo(-18, 24);
      ctx.stroke();
    }

    if (survivor) {
      ctx.strokeStyle = "#eef3ed";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 31, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * survivor.chairProgress);
      ctx.stroke();

      ctx.strokeStyle = "rgba(238, 243, 237, 0.55)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 24, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawRepairPoint(point) {
    const progress = point.completed ? 1 : point.progress;
    ctx.save();
    ctx.translate(point.x, point.y);
    if (isSoulPatrolPoint(point)) {
      const pulse = 1 + Math.sin(performance.now() / 180 + point.x * 0.01) * 0.08;
      ctx.save();
      ctx.scale(pulse, pulse);
      ctx.fillStyle = "rgba(109, 72, 174, 0.18)";
      ctx.strokeStyle = "rgba(209, 176, 255, 0.92)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 49, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([7, 7]);
      ctx.strokeStyle = "rgba(239, 224, 255, 0.78)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 58, -Math.PI / 2, Math.PI * 1.5);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
    const hasImage = drawDeviceImage("repair", 62, 74, point.completed ? 0.92 : 1);
    if (hasImage) {
      ctx.strokeStyle = point.completed ? "#b7d6c1" : "#d9b76a";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 39, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
      ctx.stroke();

      if (point.completed) {
        ctx.fillStyle = "#b7d6c1";
        ctx.font = "900 18px ui-sans-serif, system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("✓", 0, -1);
      }
      ctx.restore();
      return;
    }

    ctx.fillStyle = point.completed ? "rgba(183, 214, 193, 0.24)" : "rgba(217, 183, 106, 0.18)";
    ctx.strokeStyle = point.completed ? "#b7d6c1" : "#d9b76a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#eef3ed";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 28, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    ctx.stroke();

    ctx.fillStyle = point.completed ? "#b7d6c1" : "#fff0bc";
    ctx.font = "800 13px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(point.completed ? "✓" : "R", 0, 1);
    ctx.restore();
  }

  function drawExitGate(gate) {
    const powered = areExitsPowered();
    const opened = powered && gate.opened;
    ctx.save();
    ctx.translate(gate.x, gate.y);
    const hasImage = drawDeviceImage("gate", 78, 72, opened ? 1 : powered ? 0.95 : 0.68);
    if (hasImage) {
      if (powered && !opened) {
        ctx.strokeStyle = "#eef3ed";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 43, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * gate.progress);
        ctx.stroke();
      }

      if (!powered) {
        ctx.fillStyle = "#f2cbc5";
        ctx.font = "900 14px ui-sans-serif, system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("锁", 0, 1);
      }
      ctx.restore();
      return;
    }

    ctx.fillStyle = opened
      ? "rgba(183, 214, 193, 0.24)"
      : powered ? "rgba(217, 183, 106, 0.2)" : "rgba(185, 95, 82, 0.2)";
    ctx.strokeStyle = opened ? "#b7d6c1" : powered ? "#d9b76a" : "#b95f52";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(-28, -24, 56, 48, 8);
    ctx.fill();
    ctx.stroke();

    if (powered && !opened) {
      ctx.strokeStyle = "#eef3ed";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 35, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * gate.progress);
      ctx.stroke();
    }

    ctx.fillStyle = opened ? "#e6f3e9" : powered ? "#fff0bc" : "#f2cbc5";
    ctx.font = "800 14px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(opened ? "门" : powered ? "开" : "锁", 0, 1);
    ctx.restore();
  }

  function drawHatch() {
    if (!isHatchSpawned()) return;
    ctx.save();
    ctx.translate(hatch.x, hatch.y);
    const hasImage = drawDeviceImage(isHatchOpen() ? "hatchOpen" : "hatchClosed", 78, 70);
    if (hasImage) {
      ctx.strokeStyle = isHatchOpen() ? "#b7d6c1" : "#d9b76a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 43, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      return;
    }

    ctx.fillStyle = isHatchOpen() ? "rgba(183, 214, 193, 0.28)" : "rgba(217, 183, 106, 0.16)";
    ctx.strokeStyle = isHatchOpen() ? "#b7d6c1" : "#d9b76a";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(-30, -20, 60, 40, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isHatchOpen() ? "#101611" : "#263126";
    ctx.beginPath();
    ctx.roundRect(-20, -12, 40, 24, 4);
    ctx.fill();

    ctx.fillStyle = isHatchOpen() ? "#e6f3e9" : "#fff0bc";
    ctx.font = "800 13px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(isHatchOpen() ? "开" : "H", 0, 1);
    ctx.restore();
  }

  function drawSoulLamps() {
    if (soulLamps.length === 0) return;
    const now = performance.now();
    soulLamps.forEach((lamp) => {
      const active = now < lamp.detectingUntil;
      ctx.save();
      ctx.translate(lamp.x, lamp.y);

      ctx.fillStyle = active ? "rgba(93, 178, 255, 0.16)" : "rgba(93, 178, 255, 0.07)";
      ctx.strokeStyle = active ? "rgba(93, 178, 255, 0.68)" : "rgba(93, 178, 255, 0.24)";
      ctx.lineWidth = active ? 3 : 2;
      ctx.beginPath();
      ctx.arc(0, 0, SOUL_LAMP_RANGE, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = active ? "#5db2ff" : "#2f7fc1";
      ctx.strokeStyle = active ? "#d7efff" : "#9ed2ff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-16, -14, 32, 28, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = active ? "rgba(215, 239, 255, 0.88)" : "rgba(215, 239, 255, 0.58)";
      ctx.fillRect(-9, -7, 18, 5);
      ctx.fillRect(-9, 4, 18, 5);

      ctx.strokeStyle = active ? "rgba(215, 239, 255, 0.95)" : "rgba(158, 210, 255, 0.72)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-8, -15);
      ctx.quadraticCurveTo(0, -24, 8, -15);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawEdictTraps() {
    edictTraps.forEach((trap) => {
      ctx.save();
      ctx.translate(trap.x, trap.y);
      ctx.fillStyle = "rgba(215, 180, 106, 0.16)";
      ctx.strokeStyle = "rgba(215, 180, 106, 0.78)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, EDICTOR_TRAP_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#d7b46a";
      ctx.beginPath();
      ctx.moveTo(0, -13);
      ctx.lineTo(11, 0);
      ctx.lineTo(0, 13);
      ctx.lineTo(-11, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  }

  function drawHunterAssistObjects() {
    const now = performance.now();
    assistPeeperWards.forEach((ward) => {
      if (now >= ward.until) return;
      ctx.save();
      ctx.translate(ward.x, ward.y);
      ctx.fillStyle = "rgba(93, 178, 255, 0.06)";
      ctx.strokeStyle = "rgba(93, 178, 255, 0.28)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, ASSIST_PEEPER_RANGE, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#203245";
      ctx.strokeStyle = "#8dd0ff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-15, -10, 30, 20, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#8dd0ff";
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    if (activeShiftPortals) {
      drawShiftPortal(activeShiftPortals.near, now, "近");
      drawShiftPortal(activeShiftPortals.far, now, "远");
    }

    if (!activePatroller) return;
    ctx.save();
    ctx.translate(activePatroller.x, activePatroller.y);
    ctx.rotate(activePatroller.angle);
    ctx.fillStyle = "#101611";
    ctx.strokeStyle = "#d9b76a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(-14, -13);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-14, 13);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawAssistListenDirectionArrows() {
    if (selectedRole !== PLAYER_ROLE.hunter || !assistListenTargets.length) return;
    const now = performance.now();
    assistListenTargets = assistListenTargets.filter((item) => {
      return item &&
        item.survivor &&
        now < item.until &&
        !item.survivor.escaped &&
        item.survivor.state !== "eliminated";
    });
    assistListenTargets.forEach((item, index) => {
      const target = item.survivor;
      const angle = Math.atan2(target.y - hunter.y, target.x - hunter.x);
      const alpha = Math.max(0.25, Math.min(1, (item.until - now) / ASSIST_LISTEN_DURATION));
      const distance = 38 + index * 10;
      ctx.save();
      ctx.translate(hunter.x + Math.cos(angle) * distance, hunter.y + Math.sin(angle) * distance);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "rgba(215, 239, 255, 0.94)";
      ctx.strokeStyle = "rgba(37, 113, 208, 0.95)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(22, 0);
      ctx.lineTo(-10, -13);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-10, 13);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawAbyssSenseArrows() {
    if (selectedRole !== PLAYER_ROLE.hunter || !isAbyss()) return;
    const now = performance.now();
    const senses = (hunter.abyssSenseTargets || []).filter((item) => item && item.survivor && now < item.until && isAbyssActiveSurvivor(item.survivor));
    hunter.abyssSenseTargets = senses;
    senses.forEach((item, index) => {
      const target = item.survivor;
      const angle = Math.atan2(target.y - hunter.y, target.x - hunter.x);
      const distance = 40 + index * 12;
      ctx.save();
      ctx.translate(hunter.x + Math.cos(angle) * distance, hunter.y + Math.sin(angle) * distance);
      ctx.rotate(angle);
      ctx.globalAlpha = Math.max(0.25, Math.min(1, (item.until - now) / ABYSS_SENSE_DURATION));
      ctx.fillStyle = "rgba(161, 255, 239, 0.95)";
      ctx.strokeStyle = "rgba(31, 104, 105, 0.98)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(-10, -9);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-10, 9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawPeeperDirectionArrows() {
    if (selectedRole !== PLAYER_ROLE.hunter || assistPeeperWards.length === 0) return;
    const now = performance.now();
    const tracked = getSurvivors().filter((survivor) => {
      if (survivor.escaped || survivor.state === "eliminated" || survivor.state === "seated" || survivor.state === "carried") return false;
      return assistPeeperWards.some((ward) => now < ward.until && distanceBetween(survivor, ward) <= ASSIST_PEEPER_RANGE);
    });
    tracked.forEach((survivor, index) => {
      const angle = Math.atan2(survivor.y - hunter.y, survivor.x - hunter.x);
      const distance = 42 + index * 12;
      ctx.save();
      ctx.translate(hunter.x + Math.cos(angle) * distance, hunter.y + Math.sin(angle) * distance);
      ctx.rotate(angle);
      ctx.fillStyle = "rgba(141, 208, 255, 0.96)";
      ctx.strokeStyle = "rgba(32, 50, 69, 0.96)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(22, 0);
      ctx.lineTo(-10, -13);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-10, 13);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawWantedDirectionArrow() {
    if (selectedRole !== PLAYER_ROLE.hunter || !hunter.wantedTarget || performance.now() >= (hunter.wantedUntil || 0)) return;
    const target = hunter.wantedTarget;
    if (!target || target.escaped || target.state === "eliminated" || target.state === "seated" || target.state === "carried") return;
    const now = performance.now();
    const angle = Math.atan2(target.y - hunter.y, target.x - hunter.x);
    const alpha = Math.max(0.24, Math.min(1, (hunter.wantedUntil - now) / WANTED_REVEAL_DURATION));
    ctx.save();
    ctx.translate(hunter.x + Math.cos(angle) * 54, hunter.y + Math.sin(angle) * 54);
    ctx.rotate(angle);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(255, 226, 143, 0.95)";
    ctx.strokeStyle = "rgba(174, 58, 44, 0.95)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(28, 0);
    ctx.lineTo(-12, -16);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-12, 16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawBlinkAim() {
    if (selectedRole !== PLAYER_ROLE.hunter || hunter.assistSkill !== "blink" || activePatroller || isHunterDisplacementBlocked(performance.now()) || !canUseHunterAssist(performance.now())) return;
    const destination = getBlinkDestination();
    ctx.save();
    ctx.strokeStyle = "rgba(217, 183, 106, 0.72)";
    ctx.fillStyle = "rgba(217, 183, 106, 0.12)";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.moveTo(hunter.x, hunter.y);
    ctx.lineTo(destination.x, destination.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(destination.x, destination.y, hunter.radius + 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawShiftAim() {
    if (selectedRole !== PLAYER_ROLE.hunter || hunter.assistSkill !== "shift" || activePatroller || activeShiftPortals || isHunterDisplacementBlocked(performance.now()) || !canUseHunterAssist(performance.now())) return;
    const destination = getShiftDestination();
    ctx.save();
    ctx.strokeStyle = "rgba(185, 112, 255, 0.72)";
    ctx.fillStyle = "rgba(185, 112, 255, 0.1)";
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 8]);
    ctx.beginPath();
    ctx.moveTo(hunter.x, hunter.y);
    ctx.lineTo(destination.x, destination.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(destination.x, destination.y, ASSIST_SHIFT_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawShiftPortal(portal, now, label) {
    const pulse = 0.88 + Math.sin(now / 150) * 0.12;
    ctx.save();
    ctx.translate(portal.x, portal.y);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = "rgba(83, 51, 118, 0.38)";
    ctx.strokeStyle = "rgba(246, 232, 255, 0.86)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, ASSIST_SHIFT_RADIUS, ASSIST_SHIFT_RADIUS * 0.72, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "rgba(185, 112, 255, 0.86)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, ASSIST_SHIFT_RADIUS * 0.62, ASSIST_SHIFT_RADIUS * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#f3e8ff";
    ctx.font = "700 12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 0, 0);
    ctx.restore();
  }

  function drawPackageProjectiles() {
    packageProjectiles.forEach((item) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.angle);
      ctx.fillStyle = "#c99554";
      ctx.strokeStyle = "#101611";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-13, -9, 26, 18, 4);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = "#fff0bc";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-9, 0);
      ctx.lineTo(9, 0);
      ctx.moveTo(0, -7);
      ctx.lineTo(0, 7);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawGhostfireProjectiles() {
    ghostfireProjectiles.forEach((item) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.fillStyle = "rgba(104, 222, 196, 0.82)";
      ctx.shadowColor = "#80ffe1";
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(0, 0, GHOSTFIRE_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e6fff6";
      ctx.beginPath();
      ctx.arc(0, 0, GHOSTFIRE_RADIUS * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawEdictHooks() {
    edictHooks.forEach((hook) => {
      ctx.save();
      ctx.translate(hook.x, hook.y);
      ctx.rotate(hook.angle);
      ctx.strokeStyle = "#f5d98b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-12, -9);
      ctx.lineTo(10, 0);
      ctx.lineTo(-12, 9);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawHuntingHounds() {
    huntingHounds.forEach((hound) => {
      ctx.save();
      ctx.translate(hound.x, hound.y);
      ctx.rotate(hound.angle || 0);
      ctx.fillStyle = "#18231d";
      ctx.strokeStyle = "#d5b66f";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, -7);
      ctx.lineTo(18, -15);
      ctx.lineTo(17, -3);
      ctx.moveTo(10, 7);
      ctx.lineTo(18, 15);
      ctx.lineTo(17, 3);
      ctx.stroke();
      ctx.fillStyle = "#f1d58c";
      ctx.beginPath();
      ctx.arc(9, -3, 2.2, 0, Math.PI * 2);
      ctx.fill();
      if ((hound.leapsLeft || 0) > 0) {
        ctx.strokeStyle = "rgba(213, 182, 111, 0.58)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  function drawHammerShockEffects() {
    const now = performance.now();
    hammerShockEffects.forEach((effect) => {
      const life = Math.max(0, Math.min(1, (effect.until - now) / 420));
      ctx.save();
      ctx.translate(effect.x, effect.y);
      ctx.rotate(effect.angle);
      ctx.fillStyle = `rgba(215, 163, 95, ${0.08 + life * 0.18})`;
      ctx.strokeStyle = `rgba(255, 221, 160, ${0.24 + life * 0.66})`;
      ctx.lineWidth = 5 * life + 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, effect.range, -HAMMER_IMPACT_ARC / 2, HAMMER_IMPACT_ARC / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    const action = hunter.action;
    if (!isHammerer() || !action || action.kind !== "hammerCharge") return;
    const ratio = getHammerChargeRatio(action, now);
    const maxDistance = hunter.presenceTier >= 2 ? HAMMER_TIER_TWO_MAX_LEAP_DISTANCE : HAMMER_MAX_LEAP_DISTANCE;
    const distance = HAMMER_MIN_LEAP_DISTANCE + (maxDistance - HAMMER_MIN_LEAP_DISTANCE) * ratio;
    ctx.save();
    ctx.translate(hunter.x, hunter.y);
    ctx.rotate(action.angle);
    ctx.strokeStyle = "rgba(255, 218, 150, 0.78)";
    ctx.fillStyle = "rgba(215, 163, 95, 0.12)";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 7]);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(distance, 0);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(distance, 0, 16 + ratio * 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawTwinShadowZones() {
    if (twinShadowZones.length === 0) return;
    const now = performance.now();
    twinShadowZones.forEach((zone) => {
      const life = Math.max(0, Math.min(1, (zone.until - now) / TWIN_SHADOW_LOCK_DURATION));
      ctx.save();
      ctx.translate(zone.x, zone.y);
      ctx.fillStyle = `rgba(116, 83, 168, ${0.08 + life * 0.08})`;
      ctx.strokeStyle = "rgba(188, 154, 255, 0.44)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, zone.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawTwinAim() {
    if (!twinAim || !isTwinSword()) return;
    const range = twinAim.kind === "sword"
      ? 0
      : hunter.twinForm === TWIN_FORM_QINGTIAN
      ? twinAim.kind === "primary" ? 0 : (hunter.presenceTier >= 2 ? 780 : TWIN_SPACE_POWER_RANGE)
      : twinAim.kind === "primary" ? TWIN_SHADOW_LOCK_RANGE : TWIN_SHADOW_STRIKE_RANGE;
    const castRange = twinAim.kind === "sword"
      ? TWIN_FLYING_SWORD_RANGE
      : hunter.twinForm === TWIN_FORM_QINGTIAN
      ? (hunter.presenceTier >= 2 ? 780 : TWIN_SPACE_POWER_RANGE)
      : twinAim.kind === "primary" ? TWIN_SHADOW_LOCK_CAST_RANGE : TWIN_SHADOW_STRIKE_CAST_RANGE;
    const target = getClampedTwinAimPoint(twinAim, castRange);
    ctx.save();
    ctx.strokeStyle = twinAim.kind === "primary" ? "rgba(136, 216, 255, 0.7)" : "rgba(217, 183, 106, 0.72)";
    ctx.fillStyle = twinAim.kind === "primary" ? "rgba(136, 216, 255, 0.11)" : "rgba(217, 183, 106, 0.1)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(hunter.x, hunter.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
    if (range > 0) {
      ctx.beginPath();
      ctx.arc(target.x, target.y, range, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(target.x, target.y, twinAim.kind === "sword" ? 18 : 52, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawTwinSwordProjectiles() {
    twinSwordProjectiles.forEach((item) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.angle);
      drawQingtianFlyingSword();
      ctx.restore();
    });
  }

  function drawQingtianFlyingSword() {
    ctx.save();
    ctx.shadowColor = "rgba(90, 178, 255, 0.54)";
    ctx.shadowBlur = 12;

    const bladeGradient = ctx.createLinearGradient(-18, 0, 36, 0);
    bladeGradient.addColorStop(0, "#f7fbff");
    bladeGradient.addColorStop(0.45, "#9dd8ff");
    bladeGradient.addColorStop(1, "#2f78d6");

    ctx.fillStyle = "rgba(79, 165, 255, 0.18)";
    ctx.beginPath();
    ctx.moveTo(-32, 0);
    ctx.quadraticCurveTo(0, -15, 42, 0);
    ctx.quadraticCurveTo(0, 15, -32, 0);
    ctx.fill();

    ctx.fillStyle = bladeGradient;
    ctx.strokeStyle = "#eef8ff";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(39, 0);
    ctx.lineTo(6, -6);
    ctx.lineTo(-18, -3);
    ctx.lineTo(-24, 0);
    ctx.lineTo(-18, 3);
    ctx.lineTo(6, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(31, 0);
    ctx.stroke();

    ctx.strokeStyle = "#4f6f9f";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-24, -9);
    ctx.lineTo(-10, 9);
    ctx.moveTo(-24, 9);
    ctx.lineTo(-10, -9);
    ctx.stroke();

    ctx.fillStyle = "#2d7ad9";
    ctx.strokeStyle = "#d7efff";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(-18, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#1b385f";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-27, 0);
    ctx.lineTo(-43, 0);
    ctx.stroke();

    ctx.fillStyle = "#d7efff";
    ctx.beginPath();
    ctx.arc(-45, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawStitchPackDrops() {
    stitchPackDrops.forEach((item) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.fillStyle = "rgba(183, 214, 193, 0.18)";
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#b7d6c1";
      ctx.strokeStyle = "#101611";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-14, -10, 28, 20, 5);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = "#5aa475";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-8, -2);
      ctx.lineTo(8, -2);
      ctx.moveTo(-5, 4);
      ctx.lineTo(5, 4);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawTimeDevices() {
    getSurvivors().forEach((survivor) => {
      const device = survivor.timeDevice;
      if (!device) return;
      const timeLeft = Math.max(0, (device.until - performance.now()) / TIME_REWIND_WINDOW);
      ctx.save();
      ctx.translate(device.x, device.y);
      ctx.fillStyle = "rgba(217, 183, 106, 0.16)";
      ctx.beginPath();
      ctx.arc(0, 0, 35, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#263128";
      ctx.strokeStyle = "#d9b76a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = "#fff0bc";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -10);
      ctx.moveTo(0, 0);
      ctx.lineTo(8, 4);
      ctx.stroke();

      ctx.strokeStyle = "rgba(238, 243, 237, 0.72)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 25, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * timeLeft);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawActorDecoys() {
    const now = performance.now();
    actorDecoys.forEach((decoy) => {
      const fade = Math.max(0, Math.min(1, (decoy.until - now) / (decoy.duration || ACTOR_DECOY_DURATION)));
      ctx.save();
      ctx.translate(decoy.x, decoy.y);
      ctx.globalAlpha = selectedRole === PLAYER_ROLE.hunter ? 1 : 0.34 + fade * 0.34;
      drawHumanoidCharacter(decoy, {
        type: "survivor",
        scale: 0.95,
        decoy: true,
        now
      });
      ctx.restore();

      if (selectedRole !== PLAYER_ROLE.hunter && hunter.target === decoy) {
        ctx.save();
        ctx.translate(decoy.x, decoy.y);
        ctx.strokeStyle = "rgba(185, 95, 82, 0.75)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 34, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (selectedRole !== PLAYER_ROLE.hunter && (decoy.kind === "actorRescuePhantom" || hunter.target === decoy || decoy.state !== "healthy" || (decoy.damageProgress || 0) > 0)) {
        drawSurvivorLabel(decoy);
      }
    });
  }

  function drawPackageAim() {
    if (!packageAim) return;
    const actor = packageAim.actor;
    const dx = packageAim.targetX - actor.x;
    const dy = packageAim.targetY - actor.y;
    const distance = Math.hypot(dx, dy);
    const angle = distance > 8 ? Math.atan2(dy, dx) : actor.angle;
    const range = Math.min(PACKAGE_RANGE, Math.max(80, distance || PACKAGE_RANGE));
    const targetX = actor.x + Math.cos(angle) * range;
    const targetY = actor.y + Math.sin(angle) * range;

    ctx.save();
    ctx.strokeStyle = "rgba(255, 240, 188, 0.82)";
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 8]);
    ctx.beginPath();
    ctx.moveTo(actor.x, actor.y);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(201, 149, 84, 0.22)";
    ctx.strokeStyle = "#fff0bc";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawEdictHookAim() {
    if (!edictHookAim || !isEdictor()) return;
    const dx = edictHookAim.targetX - hunter.x;
    const dy = edictHookAim.targetY - hunter.y;
    const distance = Math.hypot(dx, dy);
    const angle = distance > 8 ? Math.atan2(dy, dx) : hunter.angle;
    const range = Math.min(EDICTOR_HOOK_RANGE, Math.max(80, distance || EDICTOR_HOOK_RANGE));
    const targetX = hunter.x + Math.cos(angle) * range;
    const targetY = hunter.y + Math.sin(angle) * range;
    ctx.save();
    ctx.strokeStyle = "rgba(245, 217, 139, 0.88)";
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 8]);
    ctx.beginPath();
    ctx.moveTo(hunter.x, hunter.y);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(215, 180, 106, 0.2)";
    ctx.strokeStyle = "#f5d98b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawAbyssTentacleAim() {
    if (!abyssTentacleAim || !isAbyss()) return;
    const dx = abyssTentacleAim.targetX - hunter.x;
    const dy = abyssTentacleAim.targetY - hunter.y;
    const distance = Math.hypot(dx, dy);
    const angle = distance > 8 ? Math.atan2(dy, dx) : hunter.angle;
    const range = Math.min(ABYSS_TENTACLE_RANGE, Math.max(80, distance || ABYSS_TENTACLE_RANGE));
    const targetX = hunter.x + Math.cos(angle) * range;
    const targetY = hunter.y + Math.sin(angle) * range;
    ctx.save();
    ctx.strokeStyle = "rgba(108, 208, 197, 0.84)";
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 8]);
    ctx.beginPath();
    ctx.moveTo(hunter.x, hunter.y);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.translate(targetX, targetY);
    ctx.rotate(angle);
    ctx.fillStyle = "rgba(29, 86, 91, 0.28)";
    ctx.strokeStyle = "rgba(153, 238, 225, 0.88)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, ABYSS_TENTACLE_STRIKE_RANGE, -ABYSS_TENTACLE_STRIKE_ARC * 0.5, ABYSS_TENTACLE_STRIKE_ARC * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawAbyssTentacles() {
    abyssTentacles.forEach((tentacle) => {
      ctx.save();
      ctx.translate(tentacle.x, tentacle.y);
      ctx.rotate(tentacle.angle);
      if (tentacle.phase === "travel") {
        ctx.strokeStyle = "rgba(83, 183, 174, 0.96)";
        ctx.lineWidth = 7;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-62, 0);
        ctx.bezierCurveTo(-34, -20, -18, 18, 0, 0);
        ctx.stroke();
        ctx.fillStyle = "#9af3e4";
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }
      const sweeping = tentacle.phase === "sweep";
      ctx.fillStyle = sweeping ? "rgba(115, 244, 224, 0.4)" : "rgba(29, 86, 91, 0.3)";
      ctx.strokeStyle = sweeping ? "rgba(210, 255, 245, 0.96)" : "rgba(153, 238, 225, 0.9)";
      ctx.lineWidth = sweeping ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, ABYSS_TENTACLE_STRIKE_RANGE, -ABYSS_TENTACLE_STRIKE_ARC * 0.5, ABYSS_TENTACLE_STRIKE_ARC * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = sweeping ? "rgba(216, 255, 246, 1)" : "rgba(83, 183, 174, 0.92)";
      ctx.lineWidth = sweeping ? 10 : 6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-62, 0);
      ctx.bezierCurveTo(-34, -20, -18, 18, 0, 0);
      if (sweeping) ctx.bezierCurveTo(58, -36, 132, -30, 202, 0);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawAbyssProjections() {
    const now = performance.now();
    abyssProjections.forEach((projection) => {
      const alpha = Math.max(0.18, Math.min(0.65, (projection.until - now) / ABYSS_PROJECTION_DURATION));
      ctx.save();
      ctx.translate(projection.x, projection.y);
      ctx.globalAlpha = alpha;
      drawHumanoidCharacter({ ...hunter, ...projection, fill: "#1d6e6d", core: "#b7fff0" }, { type: "hunter", scale: 1, now });
      if (now < (projection.attackUntil || 0)) {
        ctx.save();
        ctx.rotate(projection.angle);
        ctx.strokeStyle = "rgba(209, 255, 245, 0.95)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(12, 0, 34, -0.72, 0.72);
        ctx.stroke();
        ctx.restore();
      }
      ctx.strokeStyle = "rgba(159, 255, 238, 0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawNavigationChannels() {
    const now = performance.now();
    navigationChannels.forEach((channel) => {
      const preview = getNavigationChannelSlidePreview(channel.x, channel.y, channel.angle, channel.recipient ? channel.recipient.radius : channel.owner.radius);
      drawNavigationChannelSlidePreview(channel.x, channel.y, preview);
      ctx.save();
      ctx.translate(channel.x, channel.y);
      ctx.rotate(channel.angle);
      ctx.globalAlpha = 0.7 + Math.sin(now / 360 + channel.id) * 0.1;
      ctx.fillStyle = "rgba(74, 187, 196, 0.28)";
      ctx.strokeStyle = "rgba(184, 250, 244, 0.92)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-76, -NAVIGATION_CHANNEL_RADIUS, 152, NAVIGATION_CHANNEL_RADIUS * 2, 8);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "rgba(216, 237, 240, 0.96)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-52, 0);
      ctx.lineTo(42, 0);
      ctx.moveTo(42, 0);
      ctx.lineTo(25, -13);
      ctx.moveTo(42, 0);
      ctx.lineTo(25, 13);
      ctx.stroke();
      ctx.restore();

    });
  }

  function drawNavigationChannelSlidePreview(x, y, preview) {
    const color = preview.safe ? "rgba(124, 239, 190, 0.94)" : "rgba(244, 150, 92, 0.96)";
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = preview.safe ? "rgba(124, 239, 190, 0.18)" : "rgba(244, 150, 92, 0.2)";
    ctx.lineWidth = 2;
    ctx.setLineDash([9, 7]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(preview.x, preview.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(preview.x, preview.y, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawNavigationChannelAim() {
    if (!navigationChannelAim) return;
    const aim = navigationChannelAim;
    ctx.save();
    ctx.strokeStyle = "rgba(184, 250, 244, 0.92)";
    ctx.fillStyle = "rgba(74, 187, 196, 0.2)";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 7]);
    if (aim.phase === "placement") {
      ctx.beginPath();
      ctx.moveTo(aim.actor.x, aim.actor.y);
      ctx.lineTo(aim.x, aim.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(aim.x, aim.y, NAVIGATION_CHANNEL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (aim.phase === "direction") {
      const preview = getNavigationChannelSlidePreview(aim.x, aim.y, aim.angle, aim.actor.radius);
      drawNavigationChannelSlidePreview(aim.x, aim.y, preview);
      ctx.translate(aim.x, aim.y);
      ctx.rotate(aim.angle);
      ctx.strokeStyle = "#d8edf0";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(92, 0);
      ctx.moveTo(92, 0);
      ctx.lineTo(74, -14);
      ctx.moveTo(92, 0);
      ctx.lineTo(74, 14);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawActorRescuePhantomAim() {
    if (!actorRescuePhantomAim) return;
    const actor = actorRescuePhantomAim.actor;
    const placement = getActorRescuePhantomPlacement(actor, actorRescuePhantomAim.targetX, actorRescuePhantomAim.targetY);
    const target = placement.point;

    ctx.save();
    ctx.strokeStyle = "rgba(160, 224, 255, 0.86)";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 7]);
    ctx.beginPath();
    ctx.moveTo(actor.x, actor.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(119, 206, 255, 0.22)";
    ctx.strokeStyle = "#b8efff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(target.x, target.y, actor.radius + 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawPallets() {
    pallets.forEach((item) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.angle);

      if (item.label === "broken") {
        ctx.fillStyle = "rgba(142, 89, 57, 0.5)";
        ctx.fillRect(-item.w / 2 + 8, -4, item.w * 0.28, 7);
        ctx.fillRect(item.w / 2 - item.w * 0.36, 3, item.w * 0.28, 7);
        ctx.restore();
        return;
      }

      if (item.label === "standing") {
        ctx.translate(-item.w / 2 - 8, 0);
        ctx.rotate(Math.PI / 2);
        drawWoodBoard(46, 10);
        ctx.restore();
        return;
      }

      drawWoodBoard(item.w, item.h);
      ctx.fillStyle = "#d9b76a";
      ctx.fillRect(-item.w / 2 - 4, -item.h / 2 - 2, 4, item.h + 4);
      ctx.fillRect(item.w / 2, -item.h / 2 - 2, 4, item.h + 4);
      ctx.restore();
    });
  }

  function drawWoodBoard(boardWidth, boardHeight) {
      ctx.fillStyle = "#8b5a36";
      ctx.strokeStyle = "#d9b76a";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
    ctx.roundRect(-boardWidth / 2, -boardHeight / 2, boardWidth, boardHeight, 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 236, 186, 0.35)";
    ctx.fillRect(-boardWidth / 2 + 8, -1, Math.max(0, boardWidth - 16), 2);
  }

  function drawWindowOpening(item) {
    ctx.fillStyle = "#202b23";
    ctx.beginPath();
    ctx.roundRect(-item.w / 2, -item.h / 2, item.w, item.h, 4);
    ctx.fill();

    ctx.strokeStyle = "#b7d6c1";
    ctx.lineWidth = 4;
    if (item.w > item.h) {
      ctx.beginPath();
      ctx.moveTo(-item.w / 2 + 12, -item.h / 2 + 8);
      ctx.lineTo(item.w / 2 - 12, -item.h / 2 + 8);
      ctx.moveTo(-item.w / 2 + 12, item.h / 2 - 8);
      ctx.lineTo(item.w / 2 - 12, item.h / 2 - 8);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(-item.w / 2 + 8, -item.h / 2 + 12);
      ctx.lineTo(-item.w / 2 + 8, item.h / 2 - 12);
      ctx.moveTo(item.w / 2 - 8, -item.h / 2 + 12);
      ctx.lineTo(item.w / 2 - 8, item.h / 2 - 12);
      ctx.stroke();
    }
  }

  function drawWindows() {
    const now = performance.now();
    windows.forEach((item) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      drawWindowOpening(item);
      if (now < (item.blockedUntil || 0)) {
        const boardWidth = item.w > item.h ? item.w + 14 : item.w + 10;
        const boardHeight = item.w > item.h ? item.h + 12 : item.h + 14;
        drawWoodBoard(boardWidth, boardHeight);
      }
      ctx.restore();
    });
  }

  function getActorSpeed(actor) {
    return Math.hypot(actor.vx || 0, actor.vy || 0);
  }

  function drawCharacterShadow(scale = 1, alpha = 0.28) {
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(2 * scale, 10 * scale, 24 * scale, 14 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function canUseWalkCycle(actor, type) {
    if (!actor || actor.state === "downed" || actor.state === "seated" || actor.state === "carried") return false;
    if (type === "hunter") {
      return !["attacking", "wipe", "miss", "stunned", "breaking", "pickingUp", "placing", "vaulting", "abnormal"].includes(hunter.status);
    }
    return !actor.action || !["repairing", "openingGate", "escaping", "rescuing", "healing", "beingHealed", "dismantlingLamp", "dismantlingPeeper", "vaulting", "palletVaulting", "droppingPallet"].includes(actor.action.kind);
  }

  function getCharacterImageKey(actor, type) {
    if (type === "hunter") {
      if (actor.characterId === TWIN_SWORD_ID) {
        return actor.twinForm === TWIN_FORM_CHIYIN ? "twinChiyin" : "twinQingtian";
      }
      return actor.characterId;
    }
    if (isGeneral(actor) && isGeneralRiding(actor)) return "generalRide";
    return actor.characterId || actor.owner && actor.owner.characterId;
  }

  function getCharacterSprite(actor, type) {
    const key = getCharacterImageKey(actor, type);
    const image = CHARACTER_IMAGES[key];
    if (!key || !image || !image.complete || !image.naturalWidth) return null;
    if (CHARACTER_SPRITE_CACHE[key]) return CHARACTER_SPRITE_CACHE[key];
    const sprite = buildCharacterSprite(image, key);
    CHARACTER_SPRITE_CACHE[key] = sprite;
    return sprite;
  }

  function buildCharacterSprite(image, key) {
    const targetHeight = 112;
    const scale = targetHeight / image.naturalHeight;
    const temp = document.createElement("canvas");
    temp.width = Math.max(1, Math.round(image.naturalWidth * scale));
    temp.height = targetHeight;
    const tempCtx = temp.getContext("2d", { willReadFrequently: true });
    tempCtx.drawImage(image, 0, 0, temp.width, temp.height);
    const imageData = tempCtx.getImageData(0, 0, temp.width, temp.height);
    const data = imageData.data;
    const bg = sampleSpriteBackground(data, temp.width, temp.height);
    floodSpriteBackground(data, temp.width, temp.height, bg);
    let minX = temp.width;
    let minY = temp.height;
    let maxX = 0;
    let maxY = 0;
    for (let y = 0; y < temp.height; y += 1) {
      for (let x = 0; x < temp.width; x += 1) {
        const index = (y * temp.width + x) * 4 + 3;
        if (data[index] > 12) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }
    tempCtx.putImageData(imageData, 0, 0);
    if (minX > maxX || minY > maxY) return null;
    const padding = 3;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(temp.width - 1, maxX + padding);
    maxY = Math.min(temp.height - 1, maxY + padding);
    const bounds = {
      x: minX,
      y: minY,
      w: maxX - minX + 1,
      h: maxY - minY + 1
    };
    const sprite = document.createElement("canvas");
    sprite.width = bounds.w;
    sprite.height = bounds.h;
    const spriteCtx = sprite.getContext("2d");
    spriteCtx.imageSmoothingEnabled = false;
    spriteCtx.drawImage(temp, bounds.x, bounds.y, bounds.w, bounds.h, 0, 0, bounds.w, bounds.h);
    return {
      image: sprite,
      width: sprite.width,
      height: sprite.height
    };
  }

  function sampleSpriteBackground(data, width, height) {
    const points = [
      [2, 2],
      [width - 3, 2],
      [2, height - 3],
      [width - 3, height - 3],
      [Math.floor(width / 2), 2]
    ];
    const color = [0, 0, 0];
    points.forEach(([x, y]) => {
      const index = (Math.max(0, Math.min(height - 1, y)) * width + Math.max(0, Math.min(width - 1, x))) * 4;
      color[0] += data[index];
      color[1] += data[index + 1];
      color[2] += data[index + 2];
    });
    return color.map((value) => value / points.length);
  }

  function floodSpriteBackground(data, width, height, bg) {
    const visited = new Uint8Array(width * height);
    const queue = [];
    for (let x = 0; x < width; x += 1) {
      queue.push(x, (height - 1) * width + x);
    }
    for (let y = 1; y < height - 1; y += 1) {
      queue.push(y * width, y * width + width - 1);
    }
    let transparent = 0;
    while (queue.length) {
      const pixel = queue.pop();
      if (visited[pixel]) continue;
      visited[pixel] = 1;
      const index = pixel * 4;
      const diff = Math.abs(data[index] - bg[0]) + Math.abs(data[index + 1] - bg[1]) + Math.abs(data[index + 2] - bg[2]);
      if (diff > 108) continue;
      data[index + 3] = 0;
      transparent += 1;
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      if (x > 0) queue.push(pixel - 1);
      if (x < width - 1) queue.push(pixel + 1);
      if (y > 0) queue.push(pixel - width);
      if (y < height - 1) queue.push(pixel + width);
    }
    return transparent;
  }

  function drawCharacterSprite(actor, type, scale, now, decoy = false) {
    const sprite = getCharacterSprite(actor, type);
    if (!sprite || !sprite.image || !sprite.width || !sprite.height) return false;
    const speed = getActorSpeed(actor);
    const moving = speed > 18 && canUseWalkCycle(actor, type);
    const phase = moving ? Math.sin(now / 90 + (actor.x + actor.y) * 0.018) : Math.sin(now / 520 + (actor.x || 0) * 0.01) * 0.16;
    const attackLift = type === "hunter" ? getHunterAttackWindupLift(actor, now) : 0;
    const targetHeight = (type === "hunter" ? 76 : isGeneralRiding(actor, now) ? 86 : 66) * scale;
    const drawHeight = actor.state === "downed" ? targetHeight * 0.82 : targetHeight;
    const drawWidth = drawHeight * sprite.width / sprite.height;
    const bob = actor.state === "downed" ? 0 : moving ? Math.abs(phase) * -2 : phase * 0.9;
    const flip = Math.cos(actor.angle || 0) < -0.08 ? -1 : 1;
    const lean = actor.state === "downed" ? Math.PI / 2 : moving ? phase * 0.035 : -attackLift * 0.16;
    ctx.save();
    ctx.translate(-attackLift * 5 * scale, bob - attackLift * 2 * scale);
    ctx.rotate(lean);
    ctx.scale(flip, 1);
    if (decoy) ctx.globalAlpha *= selectedRole === PLAYER_ROLE.hunter ? 1 : 0.72;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sprite.image, -drawWidth / 2, -drawHeight + 16 * scale, drawWidth, drawHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.restore();
    return true;
  }

  function drawLimb(x1, y1, x2, y2, color, width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function drawHumanoidCharacter(actor, options = {}) {
    const now = options.now || performance.now();
    const type = options.type || "survivor";
    const scale = options.scale || 1;
    const fill = actor.state === "downed" ? "#879188" : actor.fill || options.fill || "#e9efe6";
    const core = actor.core || options.core || "#d9b76a";
    const outline = "#101611";
    const speed = getActorSpeed(actor);
    const moving = speed > 18 && canUseWalkCycle(actor, type);
    const phase = moving ? Math.sin(now / 90 + (actor.x + actor.y) * 0.018) : Math.sin(now / 520 + (actor.x || 0) * 0.01) * 0.16;
    const stride = moving ? phase : phase * 0.35;
    const bob = moving ? Math.abs(phase) * -1.6 : phase;
    const hunterScale = type === "hunter" ? 1.16 : 1;
    const finalScale = scale * hunterScale;
    const attackLift = type === "hunter" ? getHunterAttackWindupLift(actor, now) : 0;

    ctx.save();
    if (actor.state === "downed") {
      drawCharacterShadow(finalScale, 0.22);
      if (drawCharacterSprite(actor, type, finalScale, now, options.decoy)) {
        ctx.restore();
        return;
      }
      if (type === "survivor" && isMedic(actor)) {
        drawMedicCharacter(actor, finalScale, now, options.decoy, true);
        ctx.restore();
        return;
      }
      ctx.rotate((actor.angle || 0) + Math.PI / 2);
      drawCharacterShadow(finalScale, 0.24);
      ctx.translate(0, 5 * finalScale);
      drawLimb(-15 * finalScale, -8 * finalScale, 13 * finalScale, -8 * finalScale, outline, 8 * finalScale);
      drawLimb(-12 * finalScale, 8 * finalScale, 13 * finalScale, 8 * finalScale, outline, 8 * finalScale);
      ctx.fillStyle = fill;
      ctx.strokeStyle = outline;
      ctx.lineWidth = 3 * finalScale;
      ctx.beginPath();
      ctx.roundRect(-19 * finalScale, -12 * finalScale, 35 * finalScale, 24 * finalScale, 9 * finalScale);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(19 * finalScale, 0, 8 * finalScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    if (actor.state === "carried") {
      drawCharacterShadow(finalScale, 0.16);
      ctx.strokeStyle = "rgba(238, 243, 237, 0.62)";
      ctx.lineWidth = 2 * finalScale;
      ctx.beginPath();
      ctx.moveTo(0, -36 * finalScale);
      ctx.lineTo(0, -10 * finalScale);
      ctx.stroke();
      ctx.fillStyle = "rgba(217, 183, 106, 0.22)";
      ctx.strokeStyle = "#d9b76a";
      ctx.lineWidth = 2 * finalScale;
      ctx.beginPath();
      ctx.ellipse(0, -42 * finalScale, 14 * finalScale, 19 * finalScale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      drawCharacterShadow(finalScale, type === "hunter" ? 0.34 : 0.25);
    }

    if (drawCharacterSprite(actor, type, finalScale, now, options.decoy)) {
      if (type === "hunter") drawHunterAttackWindupOverlay(actor, finalScale, now);
      ctx.restore();
      return;
    }

    if (type === "survivor" && isMedic(actor)) {
      drawMedicCharacter(actor, finalScale, now, options.decoy);
      ctx.restore();
      return;
    }

    ctx.rotate(actor.angle || 0);
    if (attackLift > 0) ctx.rotate(-attackLift * 0.12);
    ctx.translate(0, bob * finalScale);

    const armColor = type === "hunter" ? "#2a1412" : "#162019";
    const legColor = type === "hunter" ? "#2a1412" : "#172119";
    const handColor = type === "hunter" ? actor.core || "#ffd5cd" : core;
    const headX = 13 * finalScale;
    const bodyX = -2 * finalScale;
    const legBackX = -16 * finalScale;

    drawLimb(-1 * finalScale, -11 * finalScale, (-13 + attackLift * 14) * finalScale, (-19 - stride * 8 - attackLift * 16) * finalScale, armColor, 5 * finalScale);
    drawLimb(-1 * finalScale, 11 * finalScale, (-13 + attackLift * 18) * finalScale, (19 + stride * 8 - attackLift * 34) * finalScale, armColor, 5 * finalScale);
    drawLimb(legBackX, -7 * finalScale, (-25 - stride * 6) * finalScale, (-13 + stride * 5) * finalScale, legColor, 6 * finalScale);
    drawLimb(legBackX, 7 * finalScale, (-25 + stride * 6) * finalScale, (13 + stride * 5) * finalScale, legColor, 6 * finalScale);

    ctx.fillStyle = fill;
    ctx.strokeStyle = outline;
    ctx.lineWidth = 3.5 * finalScale;
    ctx.beginPath();
    ctx.roundRect(-18 * finalScale, -14 * finalScale, 34 * finalScale, 28 * finalScale, 10 * finalScale);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = core;
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2.5 * finalScale;
    ctx.beginPath();
    ctx.arc(headX, 0, 10 * finalScale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = outline;
    ctx.beginPath();
    ctx.arc((headX + 4 * finalScale), -3 * finalScale, 1.7 * finalScale, 0, Math.PI * 2);
    ctx.arc((headX + 4 * finalScale), 3 * finalScale, 1.7 * finalScale, 0, Math.PI * 2);
    ctx.fill();

    if (type === "hunter") {
      drawHunterHeldItem(actor, finalScale, attackLift);
    } else {
      drawSurvivorHeldItem(actor, finalScale, handColor, options.decoy);
    }
    ctx.restore();
  }

  function drawMedicCross(cx, cy, size, color, scale) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2 * scale;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx, cy + size);
    ctx.moveTo(cx - size, cy);
    ctx.lineTo(cx + size, cy);
    ctx.stroke();
  }

  function drawMedicCharacter(actor, scale, now, decoy = false, downed = false) {
    const outline = "#101611";
    const coat = actor.state === "downed" ? "#b8c8bf" : "#f3fffb";
    const trim = decoy ? "#c7d4cf" : "#3d9f8b";
    const undershirt = "#b7d6c1";
    const skin = actor.core || "#5aa475";
    const pants = "#1f3430";
    const bag = "#d7b35f";
    const speed = getActorSpeed(actor);
    const moving = speed > 18 && canUseWalkCycle(actor, "survivor");
    const phase = moving ? Math.sin(now / 90 + (actor.x + actor.y) * 0.018) : Math.sin(now / 520 + (actor.x || 0) * 0.01) * 0.16;
    const stride = moving ? phase : phase * 0.35;
    const bob = moving ? Math.abs(phase) * -1.6 : phase;

    if (downed) {
      ctx.rotate((actor.angle || 0) + Math.PI / 2);
      ctx.translate(0, 5 * scale);
      drawLimb(-17 * scale, -10 * scale, 13 * scale, -10 * scale, outline, 8 * scale);
      drawLimb(-14 * scale, 10 * scale, 13 * scale, 10 * scale, outline, 8 * scale);
      ctx.fillStyle = pants;
      drawLimb(-18 * scale, -8 * scale, -28 * scale, -14 * scale, pants, 6 * scale);
      drawLimb(-18 * scale, 8 * scale, -28 * scale, 14 * scale, pants, 6 * scale);
      ctx.fillStyle = coat;
      ctx.strokeStyle = outline;
      ctx.lineWidth = 3 * scale;
      ctx.beginPath();
      ctx.roundRect(-20 * scale, -13 * scale, 36 * scale, 26 * scale, 8 * scale);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = trim;
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.moveTo(-3 * scale, -11 * scale);
      ctx.lineTo(-3 * scale, 11 * scale);
      ctx.stroke();
      drawMedicCross(2 * scale, 0, 4 * scale, trim, scale);
      ctx.fillStyle = skin;
      ctx.strokeStyle = outline;
      ctx.lineWidth = 2.5 * scale;
      ctx.beginPath();
      ctx.arc(19 * scale, 0, 8.5 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#f7fffb";
      ctx.strokeStyle = outline;
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.roundRect(13 * scale, -8 * scale, 13 * scale, 6 * scale, 2 * scale);
      ctx.fill();
      ctx.stroke();
      drawMedicCross(19.5 * scale, -5 * scale, 2.5 * scale, trim, scale);
      return;
    }

    ctx.rotate(actor.angle || 0);
    ctx.translate(0, bob * scale);

    drawLimb(-2 * scale, -11 * scale, (-14 - stride * 3) * scale, (-20 - stride * 8) * scale, outline, 5.5 * scale);
    drawLimb(-2 * scale, 11 * scale, (-14 + stride * 3) * scale, (20 + stride * 8) * scale, outline, 5.5 * scale);
    drawLimb(-16 * scale, -7 * scale, (-26 - stride * 6) * scale, (-13 + stride * 5) * scale, pants, 6 * scale);
    drawLimb(-16 * scale, 7 * scale, (-26 + stride * 6) * scale, (13 + stride * 5) * scale, pants, 6 * scale);

    ctx.fillStyle = coat;
    ctx.strokeStyle = outline;
    ctx.lineWidth = 3.5 * scale;
    ctx.beginPath();
    ctx.roundRect(-19 * scale, -15 * scale, 36 * scale, 30 * scale, 9 * scale);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = undershirt;
    ctx.beginPath();
    ctx.roundRect(-9 * scale, -10 * scale, 13 * scale, 20 * scale, 4 * scale);
    ctx.fill();
    ctx.strokeStyle = trim;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(-2 * scale, -13 * scale);
    ctx.lineTo(-2 * scale, 13 * scale);
    ctx.moveTo(7 * scale, -10 * scale);
    ctx.lineTo(12 * scale, -5 * scale);
    ctx.stroke();
    drawMedicCross(-12 * scale, -1 * scale, 4 * scale, trim, scale);

    ctx.fillStyle = bag;
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.roundRect(-18 * scale, 12 * scale, 14 * scale, 10 * scale, 2.5 * scale);
    ctx.fill();
    ctx.stroke();
    drawMedicCross(-11 * scale, 17 * scale, 2.5 * scale, "#f7fffb", scale);

    ctx.fillStyle = skin;
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2.5 * scale;
    ctx.beginPath();
    ctx.arc(14 * scale, 0, 10 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#f7fffb";
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.roundRect(6 * scale, -11 * scale, 16 * scale, 8 * scale, 3 * scale);
    ctx.fill();
    ctx.stroke();
    drawMedicCross(14 * scale, -7 * scale, 3 * scale, trim, scale);

    ctx.fillStyle = outline;
    ctx.beginPath();
    ctx.arc(18 * scale, -3 * scale, 1.7 * scale, 0, Math.PI * 2);
    ctx.arc(18 * scale, 3 * scale, 1.7 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawSurvivorHeldItem(actor, scale, color, decoy = false) {
    const characterId = actor.characterId || actor.owner && actor.owner.characterId;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.5 * scale;
    if (decoy) {
      ctx.fillStyle = "#eef3ed";
      ctx.font = `900 ${10 * scale}px ui-sans-serif, system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("替", -2 * scale, 0);
      return;
    }
    if (characterId === MESSENGER_ID) {
      ctx.beginPath();
      ctx.roundRect(-12 * scale, -21 * scale, 13 * scale, 9 * scale, 2 * scale);
      ctx.fill();
      return;
    }
    if (characterId === APPRENTICE_ID) {
      ctx.beginPath();
      ctx.moveTo(-13 * scale, 19 * scale);
      ctx.lineTo(0, 15 * scale);
      ctx.lineTo(-9 * scale, 25 * scale);
      ctx.stroke();
      return;
    }
    if (characterId === NAVIGATOR_ID) {
      ctx.strokeStyle = "#d6b263";
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.arc(-10 * scale, 19 * scale, 7 * scale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-10 * scale, 14 * scale);
      ctx.lineTo(-10 * scale, 24 * scale);
      ctx.moveTo(-15 * scale, 19 * scale);
      ctx.lineTo(-5 * scale, 19 * scale);
      ctx.stroke();
      return;
    }
    if (characterId === MEDIC_ID) {
      ctx.fillStyle = "#f4fffb";
      ctx.beginPath();
      ctx.roundRect(-14 * scale, -22 * scale, 14 * scale, 12 * scale, 2 * scale);
      ctx.fill();
      ctx.strokeStyle = "#3d9f8b";
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.moveTo(-7 * scale, -20 * scale);
      ctx.lineTo(-7 * scale, -12 * scale);
      ctx.moveTo(-11 * scale, -16 * scale);
      ctx.lineTo(-3 * scale, -16 * scale);
      ctx.stroke();
      return;
    }
    if (characterId === ACTOR_ID) {
      ctx.beginPath();
      ctx.arc(-12 * scale, -20 * scale, 6 * scale, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }
    if (characterId === SHIELD_BEARER_ID) {
      if (isShieldBearerGuarding(actor)) return;
      ctx.fillStyle = "#60758a";
      ctx.strokeStyle = "#d7c39a";
      ctx.lineWidth = 2.5 * scale;
      ctx.beginPath();
      ctx.roundRect(-5 * scale, -23 * scale, 11 * scale, 46 * scale, 5 * scale);
      ctx.fill();
      ctx.stroke();
      return;
    }
    ctx.beginPath();
    ctx.arc(-10 * scale, 20 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawHunterHeldItem(actor, scale, attackLift = 0) {
    const characterId = actor.characterId || hunter.characterId;
    if (characterId === SAWBONE_ID) {
      ctx.strokeStyle = "#d8d0bd";
      ctx.lineWidth = 4 * scale;
      ctx.beginPath();
      ctx.moveTo((4 + attackLift * 2) * scale, (18 - attackLift * 24) * scale);
      ctx.lineTo((31 - attackLift * 4) * scale, (25 - attackLift * 56) * scale);
      ctx.stroke();
      ctx.fillStyle = "#8f4f45";
      ctx.beginPath();
      ctx.arc((31 - attackLift * 4) * scale, (25 - attackLift * 56) * scale, 5 * scale, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    if (characterId === LANTERN_KEEPER_ID) {
      ctx.strokeStyle = "#9cc7ff";
      ctx.lineWidth = 2.5 * scale;
      ctx.beginPath();
      ctx.moveTo(0, (-15 - attackLift * 4) * scale);
      ctx.lineTo((22 - attackLift * 6) * scale, (-28 - attackLift * 24) * scale);
      ctx.stroke();
      ctx.fillStyle = "rgba(117, 179, 255, 0.72)";
      ctx.beginPath();
      ctx.roundRect((19 - attackLift * 6) * scale, (-35 - attackLift * 24) * scale, 10 * scale, 14 * scale, 3 * scale);
      ctx.fill();
      return;
    }
    if (characterId === TWIN_SWORD_ID) {
      ctx.strokeStyle = "#d7efff";
      ctx.lineWidth = 3 * scale;
      ctx.beginPath();
      ctx.moveTo(3 * scale, (17 - attackLift * 28) * scale);
      ctx.lineTo(33 * scale, (22 - attackLift * 52) * scale);
      ctx.stroke();
      ctx.strokeStyle = "#8f7dff";
      ctx.beginPath();
      ctx.moveTo(3 * scale, (-17 - attackLift * 8) * scale);
      ctx.lineTo(31 * scale, (-23 - attackLift * 20) * scale);
      ctx.stroke();
      return;
    }
    ctx.strokeStyle = actor.core || "#ffd5cd";
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo((2 + attackLift * 4) * scale, (18 - attackLift * 26) * scale);
    ctx.lineTo((25 + attackLift * 2) * scale, (21 - attackLift * 54) * scale);
    ctx.stroke();
  }

  function drawPlayer() {
    if (player.escaped || player.state === "eliminated") return;
    const now = performance.now();
    if (shouldHideSurvivorFromHunterView(player, now)) return;
    ctx.save();
    ctx.translate(player.x, player.y);
    if (isSurvivorInvisible(player, now)) ctx.globalAlpha = 0.48;
    drawHumanoidCharacter(player, { type: "survivor", scale: 1.02, now });
    ctx.restore();
    if (isShieldBearerGuarding(player, now)) drawShieldBearerGuard(player, now);
    drawSoulSiphonFlame(player, now);
    if (hasMedicShield(player, now)) drawMedicShield(player, now);

    if (player.action && ["repairing", "openingGate", "escaping", "rescuing", "dismantlingLamp", "dismantlingPeeper", "dismantlingSoulPatrol"].includes(player.action.kind)) {
      drawSurvivorLabel(player);
    } else if (player.state !== "healthy" || getDamageProgressPercent(player) > 0 || (player.shackleValue || 0) > 0 || now < (player.shackledUntil || 0) || getSoulMarks(player) > 0 || getBoneBleedStacks(player) > 0 || hasMedicShield(player, now) || now < (player.kneeJerkBoostUntil || 0) || isSurvivorInvisible(player, now)) {
      drawSurvivorLabel(player);
    }

    if (hunter.target === player) {
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.strokeStyle = "rgba(185, 95, 82, 0.75)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    drawPlayerInteractionHint();
  }

  function drawTeammates() {
    teammates.forEach((survivor) => {
      if (!survivor.escaped && survivor.state !== "eliminated" && !shouldHideSurvivorFromHunterView(survivor)) drawSurvivor(survivor, false);
    });
  }

  function drawSurvivor(survivor, showName) {
    const now = performance.now();
    if (shouldHideSurvivorFromHunterView(survivor, now)) return;
    ctx.save();
    ctx.translate(survivor.x, survivor.y);
    if (isSurvivorInvisible(survivor, now)) ctx.globalAlpha = 0.48;
    drawHumanoidCharacter(survivor, { type: "survivor", scale: 0.98, now });
    ctx.restore();
    if (isShieldBearerGuarding(survivor, now)) drawShieldBearerGuard(survivor, now);
    drawSoulSiphonFlame(survivor, now);

    if (hunter.target === survivor) {
      ctx.save();
      ctx.translate(survivor.x, survivor.y);
      ctx.strokeStyle = "rgba(185, 95, 82, 0.75)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    if (hasMedicShield(survivor, now)) drawMedicShield(survivor, now);

    if (showName || survivor.state !== "healthy" || getDamageProgressPercent(survivor) > 0 || (survivor.shackleValue || 0) > 0 || now < (survivor.shackledUntil || 0) || getSoulMarks(survivor) > 0 || getBoneBleedStacks(survivor) > 0 || survivor.stitchPack || hasMedicShield(survivor, now) || isGeneralRiding(survivor, now) || isShieldBearerGuarding(survivor, now) || now < (survivor.kneeJerkBoostUntil || 0) || now < (survivor.medicAdrenalineUntil || 0) || now < (survivor.mirrorBlindUntil || 0) || (survivor.medicAdrenalinePendingDamage || 0) > 0 || (survivor.medicRescueShockPendingDamage || 0) > 0 || isSurvivorInvisible(survivor, now) || survivor.action && ["dismantlingLamp", "dismantlingPeeper", "dismantlingSoulPatrol"].includes(survivor.action.kind) || now < survivor.boostUntil) {
      drawSurvivorLabel(survivor);
    }
  }

  function drawShieldBearerGuard(survivor, now) {
    const pulse = 0.88 + Math.sin(now / 120) * 0.08;
    ctx.save();
    ctx.translate(survivor.x, survivor.y);
    ctx.rotate(survivor.angle || 0);
    ctx.globalAlpha = pulse;
    ctx.fillStyle = "rgba(74, 96, 116, 0.86)";
    ctx.strokeStyle = "rgba(229, 210, 163, 0.96)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(20, -31, 13, 62, 6);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(240, 226, 188, 0.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(26.5, -24);
    ctx.lineTo(26.5, 24);
    ctx.stroke();
    ctx.restore();
  }

  function drawMedicShield(survivor, now) {
    const pulse = 0.82 + Math.sin(now / 110) * 0.08;
    ctx.save();
    ctx.translate(survivor.x, survivor.y);
    ctx.strokeStyle = `rgba(105, 210, 225, ${pulse})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, survivor.radius + 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawSoulSiphonFlame(survivor, now) {
    if (!isSoulBinder() || hunter.soulSiphonTarget !== survivor || now >= (hunter.soulSiphonUntil || 0)) return;
    const pulse = 0.9 + Math.sin(now / 115) * 0.1;
    const flicker = Math.sin(now / 72 + survivor.x * 0.02) * 3;
    ctx.save();
    ctx.translate(survivor.x, survivor.y - 62 + flicker);
    ctx.scale(pulse, pulse);

    const glow = ctx.createRadialGradient(0, 2, 2, 0, 2, 26);
    glow.addColorStop(0, "rgba(180, 228, 255, 0.72)");
    glow.addColorStop(1, "rgba(93, 178, 255, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 2, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(93, 178, 255, 0.92)";
    ctx.strokeStyle = "rgba(215, 239, 255, 0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.bezierCurveTo(-18, -8, -11, 14, 0, 18);
    ctx.bezierCurveTo(12, 13, 20, -7, 0, -24);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(215, 239, 255, 0.86)";
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.bezierCurveTo(-7, -3, -4, 8, 0, 10);
    ctx.bezierCurveTo(5, 7, 8, -3, 0, -12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawSurvivorLabel(survivor) {
    const displayName = survivor.kind === "actorRescuePhantom" ? "救援幻影" : getSurvivorDisplayName(survivor);
    let label = displayName;
    if (survivor.action && survivor.action.kind === "healing") {
      label = "治疗中";
    } else if (survivor.action && survivor.action.kind === "selfHealing" && selectedRole !== PLAYER_ROLE.hunter) {
      label = `自愈 ${Math.round((survivor.healProgress || 0) * 100)}%`;
    } else if (survivor.action && survivor.action.kind === "beingHealed") {
      label = `治疗 ${Math.round((survivor.healProgress || 0) * 100)}%`;
    } else if (survivor.action && survivor.action.kind === "repairing") {
      label = `修理 ${Math.round(survivor.action.point.progress * 100)}%`;
    } else if (survivor.action && survivor.action.kind === "openingGate") {
      label = `开门 ${Math.round(survivor.action.gate.progress * 100)}%`;
    } else if (survivor.action && survivor.action.kind === "escaping") {
      const progress = getActionProgress(survivor.action, performance.now());
      label = `逃出 ${Math.round(progress * 100)}%`;
    } else if (survivor.action && survivor.action.kind === "rescuing") {
      const progress = getActionProgress(survivor.action, performance.now());
      label = `救援 ${Math.round(progress * 100)}%`;
    } else if (survivor.action && survivor.action.kind === "dismantlingLamp") {
      const progress = getActionProgress(survivor.action, performance.now());
      label = `拆灯 ${Math.round(progress * 100)}%`;
    } else if (survivor.action && survivor.action.kind === "dismantlingPeeper") {
      const progress = getActionProgress(survivor.action, performance.now());
      label = `拆眼 ${Math.round(progress * 100)}%`;
    } else if (survivor.action && survivor.action.kind === "dismantlingSoulPatrol") {
      const progress = getActionProgress(survivor.action, performance.now());
      label = `拆魂印 ${Math.round(progress * 100)}%`;
    } else if (isShieldBearerGuarding(survivor)) label = `${displayName} 举盾`;
    else if (survivor.stitchPack) label = `${displayName} 针线 ${getStitchSecondsLeft(survivor)}秒`;
    else if (performance.now() < (survivor.listenRevealUntil || 0)) label = `${displayName} 聆听`;
    else if (performance.now() < (survivor.assistRevealUntil || 0)) label = `${displayName} 爆点`;
    else if (performance.now() < (survivor.mirrorBlindUntil || 0)) label = `${displayName} 致盲`;
    else if (performance.now() < (survivor.patrollerHoldUntil || 0)) label = `${displayName} 被咬`;
    else if (isSurvivorInvisible(survivor)) label = `${displayName} 隐身`;
    else if (performance.now() < (survivor.shackledUntil || 0)) label = `${displayName} 枷锁`;
    else if ((survivor.shackleValue || 0) > 0) label = `${displayName} 枷锁${Math.round(survivor.shackleValue)}`;
    else if (getSoulMarks(survivor) > 0) label = `${displayName} 魂印${getSoulMarks(survivor)}`;
    else if (getDamageProgressPercent(survivor) > 0) label = `${displayName} ${getDamageProgressLabel(survivor)}`;
    else if (getBoneBleedStacks(survivor) > 0) label = `${displayName} 流血x${getBoneBleedStacks(survivor)}`;
    else if (performance.now() < survivor.boostUntil) label = `${displayName} 加速`;
    else if (survivor.state === "injured") label = `${displayName} 受伤`;
    else if (survivor.state === "downed") label = `${displayName} 放血 ${getBleedOutSecondsLeft(survivor)}秒`;
    else if (survivor.state === "carried") label = `挣扎 ${Math.round((survivor.carryProgress || 0) * 100)}%`;
    else if (survivor.state === "seated") label = `上椅 ${Math.round(survivor.chairProgress * 100)}%`;

    ctx.save();
    ctx.translate(survivor.x, survivor.y - 38);
    ctx.fillStyle = survivor.action && ["beingHealed", "selfHealing", "repairing", "openingGate", "escaping", "rescuing", "dismantlingLamp", "dismantlingPeeper"].includes(survivor.action.kind) || survivor.stitchPack || isSurvivorInvisible(survivor) || isAssistRevealed(survivor)
      ? "#b7d6c1"
      : getDamageProgressPercent(survivor) > 0 ? "#d9b76a" : getBoneBleedStacks(survivor) > 0 ? "#c78068" : survivor.state === "healthy" ? "rgba(16, 22, 18, 0.86)" : survivor.state === "injured" ? "#d9b76a" : "#b95f52";
    ctx.beginPath();
    ctx.roundRect(-40, -9, 80, 18, 6);
    ctx.fill();
    ctx.fillStyle = survivor.state === "healthy" && (survivor.damageProgress || 0) <= 0 && getBoneBleedStacks(survivor) <= 0 && !survivor.stitchPack && !isSurvivorInvisible(survivor) && !isAssistRevealed(survivor) && (!survivor.action || !["beingHealed", "selfHealing", "repairing", "openingGate", "escaping", "rescuing", "dismantlingLamp", "dismantlingPeeper"].includes(survivor.action.kind)) ? "#eef3ed" : "#101611";
    ctx.font = "700 11px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 0, 1);
    ctx.restore();
  }

  function drawPlayerInteractionHint() {
    if (selectedRole !== PLAYER_ROLE.survivor) return;
    if (player.action || player.escaped) return;

    if (isShieldBearerGuarding(player)) {
      const seatedTarget = findNearestSeatedTeammate(player, 96);
      const droppedPallet = findNearestPallet(player, "dropped", SURVIVOR_PALLET_PROMPT_RANGE);
      const nearWindow = findNearestWindow(player, SURVIVOR_WINDOW_PROMPT_RANGE);
      const label = seatedTarget
        ? `E 救${seatedTarget.name}`
        : droppedPallet ? "Space 翻板" : nearWindow ? "Space 翻窗" : "举盾中";
      drawFloatingPrompt(player.x, player.y + 42, label);
      return;
    }

    if (isGeneralRiding(player)) {
      drawFloatingPrompt(player.x, player.y + 42, "E 下马");
      return;
    }

    const nearHatch = findNearestHatch(player, 96);
    if (nearHatch && (player.state === "healthy" || player.state === "injured" || player.state === "downed")) {
      drawFloatingPrompt(player.x, player.y + 42, "E 跳地窖");
      return;
    }

    const downedExit = areExitsPowered() ? findNearestExitGate(player, GATE_USE_RANGE) : null;
    if (player.state === "downed" && downedExit && downedExit.opened) {
      drawFloatingPrompt(player.x, player.y + 42, "E 逃出");
      return;
    }

    if (player.state !== "healthy" && player.state !== "injured") return;

    const seatedTarget = findNearestSeatedTeammate(player, 96);
    const healTarget = findNearestHealableTeammate(player, 92);
    const canDropStitchPack = isApprentice(player) && canPlaceStitchPack(player);
    const peeperWard = findNearestPeeperWard(player, ASSIST_PEEPER_DISMANTLE_RANGE);
    const soulLamp = findNearestSoulLamp(player, SOUL_LAMP_DISMANTLE_RANGE);
    const nearExit = areExitsPowered() ? findNearestExitGate(player, GATE_USE_RANGE) : null;
    const repairPoint = findNearestRepairPoint(player, 110);
    const standingPallet = findNearestPallet(player, "standing", SURVIVOR_PALLET_PROMPT_RANGE);
    const droppedPallet = findNearestPallet(player, "dropped", SURVIVOR_PALLET_PROMPT_RANGE);
    const nearWindow = findNearestWindow(player, SURVIVOR_WINDOW_PROMPT_RANGE);
    let label = "";
    if (peeperWard) label = "E 拆插眼";
    else if (soulLamp) label = "E 拆魂灯";
    else if (seatedTarget) label = `E 救${seatedTarget.name}`;
    else if (canDropStitchPack) label = canReceiveStitchPack(player) ? "Q 用针线包" : "Q 放针线包";
    else if (healTarget) label = `E 治疗${healTarget.name}`;
    else if (nearExit) label = nearExit.opened ? "E 逃出" : "E 开门";
    else if (repairPoint) label = "E 修理";
    else if (standingPallet) label = "Space 下板";
    else if (droppedPallet) label = "Space 翻板";
    else if (nearWindow) label = "Space 翻窗";
    if (!label) return;

    drawFloatingPrompt(player.x, player.y + 42, label);
  }

  function drawFloatingPrompt(x, y, label) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(16, 22, 18, 0.86)";
    ctx.strokeStyle = "rgba(238, 243, 237, 0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-48, -15, 96, 30, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#eef3ed";
    ctx.font = "700 12px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 0, 1);
    ctx.restore();
  }

  function getActionProgress(action, now) {
    return Math.max(0, Math.min(1, (now - action.start) / Math.max(action.until - action.start, 1)));
  }

  function getHunterAttackWindupLift(actor, now) {
    const action = actor && actor.action;
    if (!action || action.kind !== "attackWindup") return 0;
    return Math.sin(getActionProgress(action, now) * Math.PI / 2);
  }

  function drawHunterAttackWindupOverlay(actor, scale, now) {
    const lift = getHunterAttackWindupLift(actor, now);
    if (lift <= 0) return;
    ctx.save();
    ctx.rotate(actor.angle || 0);
    drawHunterHeldItem(actor, scale, lift);
    ctx.restore();
  }

  function drawHunter() {
    const now = performance.now();
    if (selectedRole === PLAYER_ROLE.survivor && isHunterInvisibleToSurvivors(now)) return;
    const character = getHunterCharacter();

    ctx.save();
    ctx.translate(hunter.x, hunter.y);

    if (isTwinSword() && (hunter.twinForm === TWIN_FORM_CHIYIN || now < (hunter.invisibleUntil || 0))) {
      ctx.globalAlpha = selectedRole === PLAYER_ROLE.hunter ? 0.62 : 0.28;
    }

    if (isAbyssForm(now)) {
      ctx.fillStyle = "rgba(76, 197, 183, 0.2)";
      ctx.strokeStyle = "rgba(179, 255, 237, 0.8)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 42 + Math.sin(now / 180) * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    if (hunter.action && hunter.action.kind === "sawDash") {
      ctx.strokeStyle = hunter.action.short ? "rgba(238, 243, 237, 0.42)" : "rgba(217, 208, 189, 0.5)";
      ctx.lineWidth = hunter.action.short ? 12 : 18;
      ctx.beginPath();
      ctx.moveTo(-Math.cos(hunter.angle) * 42, -Math.sin(hunter.angle) * 42);
      ctx.lineTo(-Math.cos(hunter.angle) * 110, -Math.sin(hunter.angle) * 110);
      ctx.stroke();
    }

    drawHumanoidCharacter({
      ...hunter,
      fill: character.fill || "#b95f52",
      core: character.core || "#ffd5cd"
    }, {
      type: "hunter",
      scale: 1,
      now
    });

    ctx.restore();

    if (isTwinSword() && (hunter.twinFlyingSwords || 0) > 0) {
      ctx.save();
      ctx.translate(hunter.x, hunter.y);
      ctx.strokeStyle = "rgba(215, 239, 255, 0.86)";
      ctx.lineWidth = 3;
      const count = Math.min(8, hunter.twinFlyingSwords || 0);
      for (let index = 0; index < count; index += 1) {
        const angle = (Math.PI * 2 * index) / count + now / 900;
        const x = Math.cos(angle) * 43;
        const y = Math.sin(angle) * 43;
        ctx.beginPath();
        ctx.moveTo(x - Math.cos(angle) * 11, y - Math.sin(angle) * 11);
        ctx.lineTo(x + Math.cos(angle) * 11, y + Math.sin(angle) * 11);
        ctx.stroke();
      }
      ctx.fillStyle = "#d7efff";
      ctx.font = "900 13px ui-sans-serif, system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(hunter.twinFlyingSwords || 0), 0, -52);
      ctx.restore();
    }

    if (hunter.status === "stunned" || hunter.status === "wipe" || hunter.status === "miss" || hunter.status === "breaking" || hunter.status === "pickingUp" || hunter.status === "dismantlingChannel" || hunter.status === "sawDash" || hunter.status === "shortSaw" || hunter.status === "sawHit") {
      ctx.save();
      ctx.translate(hunter.x, hunter.y - 42);
      ctx.fillStyle = hunter.status === "stunned" ? "#d9b76a" : "#b95f52";
      ctx.beginPath();
      ctx.roundRect(-30, -9, 60, 18, 6);
      ctx.fill();
      ctx.fillStyle = "#101611";
      ctx.font = "700 12px ui-sans-serif, system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(getHunterStatusLabel(hunter.status), 0, 1);
      ctx.restore();
    }

    drawHunterInteractionHint(now);
    drawSoulPatrolAura(now);
  }

  function drawSoulPatrolAura(now) {
    if (!isSoulPatrolActive(now)) return;
    const pulse = 1 + Math.sin(now / 105) * 0.07;
    ctx.save();
    ctx.translate(hunter.x, hunter.y);
    ctx.scale(pulse, pulse);
    ctx.strokeStyle = "rgba(211, 178, 255, 0.9)";
    ctx.fillStyle = "rgba(100, 68, 164, 0.14)";
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, hunter.radius + 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawHunterInteractionHint(now) {
    if (selectedRole !== PLAYER_ROLE.hunter || !matchStarted) return;
    if (hunter.action || now < hunter.stunnedUntil || now < hunter.wipeUntil) return;

    const emptyChair = hunter.carrying ? findNearestEmptyChair(hunter, 116) : null;
    const downedSurvivor = !hunter.carrying ? findNearestDownedSurvivor(hunter, 112) : null;
    const droppedPallet = findNearestPallet(hunter, "dropped", HUNTER_PALLET_PROMPT_RANGE);
    const navigationChannel = findNearestNavigationChannel(hunter, NAVIGATION_CHANNEL_DISMANTLE_RANGE);
    const nearWindow = findNearestWindow(hunter, HUNTER_WINDOW_PROMPT_RANGE);
    let label = "";
    if (emptyChair) label = "Space 挂椅";
    else if (downedSurvivor) label = "Space 牵起";
    else if (droppedPallet) label = "Space 踩板";
    else if (navigationChannel) label = "Space 拆航道";
    else if (nearWindow) label = "Space 翻窗";
    else if (canRecallSoulLamp(now)) label = "Q 收回灯";
    else if (canPlaceSoulLamp(now)) label = "Q 寄魂灯";
    else if (canShadowTeleport(now)) label = "F 灯影";
    else if (canUseHunterAssist(now)) label = `L ${getHunterAssistName()}`;
    else if (canHunterAttack(now)) label = "J 攻击";
    if (!label) return;

    ctx.save();
    ctx.translate(hunter.x, hunter.y + 46);
    ctx.fillStyle = "rgba(16, 22, 18, 0.86)";
    ctx.strokeStyle = "rgba(238, 243, 237, 0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-48, -15, 96, 30, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#eef3ed";
    ctx.font = "700 12px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 0, 1);
    ctx.restore();
  }

  function drawLanternAlert() {
    if (!lanternAlert || performance.now() >= lanternAlert.until) return;
    ctx.save();
    ctx.translate(width / 2, 72);
    ctx.fillStyle = lanternAlert.kind === "detected" ? "rgba(93, 178, 255, 0.92)" : "rgba(16, 22, 18, 0.9)";
    ctx.strokeStyle = "rgba(215, 239, 255, 0.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-86, -18, 172, 36, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = lanternAlert.kind === "detected" ? "#101611" : "#d7efff";
    ctx.font = "800 14px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(lanternAlert.text, 0, 1);
    ctx.restore();
  }

  function drawRepairCalibration() {
    if (selectedRole !== PLAYER_ROLE.survivor || !player.action || player.action.kind !== "repairing") return;
    const action = player.action;
    const now = performance.now();
    const calibration = action.calibration;
    const feedback = action.calibrationFeedback && now < action.calibrationFeedback.until
      ? action.calibrationFeedback
      : null;
    if (!calibration && !feedback) return;

    const panelWidth = Math.min(420, Math.max(280, width - 40));
    const panelHeight = calibration ? 96 : 54;
    const x = width / 2 - panelWidth / 2;
    const y = Math.max(112, height - panelHeight - 112);

    ctx.save();
    ctx.fillStyle = "rgba(16, 22, 18, 0.9)";
    ctx.strokeStyle = "rgba(238, 243, 237, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, panelWidth, panelHeight, 8);
    ctx.fill();
    ctx.stroke();

    const title = feedback ? feedback.label : "修机校准";
    ctx.fillStyle = feedback ? feedback.color : "#eef3ed";
    ctx.font = "900 16px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, width / 2, y + 22);

    if (calibration) {
      const barX = x + 24;
      const barY = y + 50;
      const barW = panelWidth - 48;
      const barH = 18;
      const needle = getRepairCalibrationNeedle(calibration, now);

      ctx.fillStyle = "#263128";
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, 6);
      ctx.fill();

      ctx.fillStyle = "rgba(183, 214, 193, 0.72)";
      ctx.beginPath();
      ctx.roundRect(barX + barW * calibration.successStart, barY, barW * (calibration.successEnd - calibration.successStart), barH, 5);
      ctx.fill();

      ctx.fillStyle = "#d9b76a";
      ctx.beginPath();
      ctx.roundRect(barX + barW * calibration.perfectStart, barY - 3, barW * (calibration.perfectEnd - calibration.perfectStart), barH + 6, 5);
      ctx.fill();

      ctx.strokeStyle = "#eef3ed";
      ctx.lineWidth = 3;
      const needleX = barX + barW * needle;
      ctx.beginPath();
      ctx.moveTo(needleX, barY - 8);
      ctx.lineTo(needleX, barY + barH + 8);
      ctx.stroke();

      ctx.fillStyle = "#9ba99d";
      ctx.font = "700 12px ui-sans-serif, system-ui";
      ctx.fillText("按 E / 使用", width / 2, y + 82);
    }

    ctx.restore();
  }

  function drawHunterAttackCone(now) {
    if (selectedRole === PLAYER_ROLE.survivor && isHunterInvisibleToSurvivors(now)) return;
    if (isTwinForm(TWIN_FORM_CHIYIN)) return;
    if (isTwinSword() && now < (hunter.invisibleUntil || 0)) return;
    const halfArc = hunter.attackArc / 2;
    const pulseFill = now < chasePulseUntil ? 0.22 : 0.1;
    ctx.save();
    ctx.rotate(hunter.angle);
    ctx.fillStyle = `rgba(185, 95, 82, ${pulseFill})`;
    ctx.strokeStyle = now < chasePulseUntil ? "rgba(185, 95, 82, 0.72)" : "rgba(185, 95, 82, 0.32)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, hunter.attackRange, -halfArc, halfArc);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawHunterRedLight(now = performance.now()) {
    if (selectedRole !== PLAYER_ROLE.survivor || isTwinForm(TWIN_FORM_CHIYIN)) return;

    const halfArc = hunter.attackArc / 2;
    const radius = hunter.attackRange;
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, "rgba(228, 52, 48, 0.44)");
    gradient.addColorStop(0.62, "rgba(206, 38, 39, 0.24)");
    gradient.addColorStop(1, "rgba(180, 25, 30, 0)");

    ctx.save();
    ctx.translate(hunter.x, hunter.y);
    ctx.rotate(hunter.angle);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, -halfArc, halfArc);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawVignette() {
    const focus = getCameraTarget();
    const gradient = ctx.createRadialGradient(
      focus.x,
      focus.y,
      120,
      focus.x,
      focus.y,
      560
    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.28)");
    ctx.fillStyle = gradient;
    ctx.fillRect(camera.x, camera.y, width / camera.zoom, height / camera.zoom);
  }

  function isSurvivorInHeartbeat(survivor) {
    if (selectedRole === PLAYER_ROLE.survivor && isTwinForm(TWIN_FORM_CHIYIN)) return false;
    return Boolean(
      survivor &&
      !survivor.escaped &&
      survivor.state !== "eliminated" &&
      survivor.state !== "seated" &&
      survivor.state !== "carried" &&
      distanceBetween(survivor, hunter) <= HEARTBEAT_RANGE
    );
  }

  function drawHeartbeatIndicators() {
    if (isInfiniteSawboneMode()) return;
    if (selectedRole !== PLAYER_ROLE.survivor) return;
    const now = performance.now();
    getSurvivors().forEach((survivor) => {
      if (!isSurvivorInHeartbeat(survivor)) return;
      const pulse = 0.82 + Math.sin(now / 130) * 0.18;
      ctx.save();
      ctx.translate(survivor.x + 26, survivor.y - 50);
      ctx.scale(pulse, pulse);
      ctx.fillStyle = "rgba(185, 112, 255, 0.92)";
      ctx.strokeStyle = "rgba(246, 232, 255, 0.82)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 12);
      ctx.bezierCurveTo(-28, -8, -14, -30, 0, -14);
      ctx.bezierCurveTo(14, -30, 28, -8, 0, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
  }

  function hasHunterTinnitus() {
    if (selectedRole !== PLAYER_ROLE.hunter) return false;
    return getSurvivors().some(isSurvivorInHeartbeat);
  }

  function drawHunterTinnitusIndicator() {
    if (!hasHunterTinnitus()) return;
    const now = performance.now();
    const pulse = 0.9 + Math.sin(now / 120) * 0.1;
    ctx.save();
    ctx.translate(44, 112);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = "rgba(83, 51, 118, 0.92)";
    ctx.strokeStyle = "rgba(246, 232, 255, 0.86)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#f3e8ff";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(-3, 0, 8, -Math.PI * 0.55, Math.PI * 0.62);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-2, 2, 4, -Math.PI * 0.45, Math.PI * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(9, -7);
    ctx.lineTo(14, -12);
    ctx.moveTo(11, 0);
    ctx.lineTo(18, 0);
    ctx.moveTo(9, 7);
    ctx.lineTo(14, 12);
    ctx.stroke();
    ctx.restore();
  }

  function drawMatchResult() {
    if (!matchResult) return;

    ctx.save();
    ctx.fillStyle = "rgba(16, 22, 18, 0.62)";
    ctx.fillRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);

    ctx.fillStyle = "rgba(23, 31, 25, 0.94)";
    ctx.strokeStyle = "rgba(238, 243, 237, 0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-190, -74, 380, 148, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = matchResult.winner === "hunter" ? "#f2cbc5" : matchResult.winner === "draw" ? "#d9b76a" : "#b7d6c1";
    ctx.font = "900 30px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(matchResult.title, 0, -26);

    ctx.fillStyle = "#eef3ed";
    ctx.font = "700 14px ui-sans-serif, system-ui";
    ctx.fillText(matchResult.detail, 0, 16);

    ctx.fillStyle = "#9ba99d";
    ctx.font = "700 12px ui-sans-serif, system-ui";
    ctx.fillText("按 R 重新开始", 0, 46);
    ctx.restore();
  }

  function drawMiniMap() {
    const box = miniMap.getBoundingClientRect();
    const miniW = box.width;
    const miniH = box.height;
    miniCtx.clearRect(0, 0, miniW, miniH);
    miniCtx.fillStyle = "#1f2a22";
    miniCtx.fillRect(0, 0, miniW, miniH);

    const scale = Math.min(miniW / world.width, miniH / world.height);
    const offsetX = (miniW - world.width * scale) / 2;
    const offsetY = (miniH - world.height * scale) / 2;

    miniCtx.save();
    miniCtx.translate(offsetX, offsetY);
    miniCtx.scale(scale, scale);
    miniCtx.fillStyle = "#101611";
    walls.forEach((wall) => miniCtx.fillRect(wall.x, wall.y, wall.w, wall.h));
    windows.forEach((item) => {
      miniCtx.fillStyle = performance.now() < (item.blockedUntil || 0) ? "#8b5a36" : "#b7d6c1";
      if (item.w > item.h) {
        miniCtx.fillRect(item.x - 24, item.y - 3, 48, 6);
      } else {
        miniCtx.fillRect(item.x - 3, item.y - 24, 6, 48);
      }
    });
    miniCtx.fillStyle = "#8e5939";
    pallets.forEach((item) => {
      if (item.label === "broken") return;
      miniCtx.save();
      miniCtx.translate(item.x, item.y);
      miniCtx.rotate(item.angle);
      if (item.label === "standing") {
        miniCtx.translate(-25, 0);
        miniCtx.rotate(Math.PI / 2);
        miniCtx.fillRect(-10, -2, 20, 4);
      } else {
        miniCtx.fillRect(-22, -3, 44, 6);
      }
      miniCtx.restore();
    });
    chairs.forEach((item) => {
      miniCtx.fillStyle = item.survivor ? "#b95f52" : "#d9b76a";
      miniCtx.fillRect(item.x - 10, item.y - 10, 20, 20);
    });
    repairPoints.forEach((point) => {
      miniCtx.fillStyle = point.completed ? "#b7d6c1" : "#d9b76a";
      miniCtx.fillRect(point.x - 12, point.y - 12, 24, 24);
    });
    exitGates.forEach((gate) => {
      miniCtx.fillStyle = gate.opened ? "#b7d6c1" : areExitsPowered() ? "#d9b76a" : "#b95f52";
      miniCtx.fillRect(gate.x - 14, gate.y - 14, 28, 28);
    });
    if (isHatchSpawned()) {
      miniCtx.fillStyle = isHatchOpen() ? "#b7d6c1" : "#d9b76a";
      miniCtx.fillRect(hatch.x - 16, hatch.y - 10, 32, 20);
    }
    soulLamps.forEach((lamp) => {
      miniCtx.fillStyle = performance.now() < lamp.detectingUntil ? "#d7efff" : "#5db2ff";
      miniCtx.fillRect(lamp.x - 13, lamp.y - 11, 26, 22);
    });
    if (!(selectedRole === PLAYER_ROLE.survivor && isHunterInvisibleToSurvivors())) {
      miniCtx.fillStyle = getHunterCharacter().fill || "#b95f52";
      miniCtx.beginPath();
      miniCtx.arc(hunter.x, hunter.y, 38, 0, Math.PI * 2);
      miniCtx.fill();
    }
    {
      teammates.forEach((survivor) => {
        if (survivor.escaped || survivor.state === "eliminated") return;
        if (shouldHideSurvivorFromHunterView(survivor)) return;
        miniCtx.fillStyle = survivor.core;
        miniCtx.beginPath();
        miniCtx.arc(survivor.x, survivor.y, 30, 0, Math.PI * 2);
        miniCtx.fill();
      });
      if (!player.escaped && player.state !== "eliminated" && !shouldHideSurvivorFromHunterView(player)) {
        miniCtx.fillStyle = "#eef3ed";
        miniCtx.beginPath();
        miniCtx.arc(player.x, player.y, 34, 0, Math.PI * 2);
        miniCtx.fill();
      }
    }
    miniCtx.restore();
  }

  function updateReadouts(now = performance.now(), force = false) {
    if (!force && now - lastHudUpdateAt < HUD_UPDATE_INTERVAL) return;
    lastHudUpdateAt = now;
    updateCipherStatusReadout();
    updateHunterPresenceBadge();
    updateSurvivorStatusGrid();
    updateCooldownPanel();
    updateTouchActions();
    updateQuickChat();
  }

  function updateQuickChat() {
    if (!quickChat || !quickChatToggle || !quickChatMenu || !quickChatTargetReadout) return;
    const visible = matchStarted && selectedRole === PLAYER_ROLE.survivor;
    if (!visible) quickChatOpen = false;
    quickChat.classList.toggle("is-hidden", !visible);
    quickChatMenu.hidden = !quickChatOpen;
    quickChatToggle.setAttribute("aria-expanded", quickChatOpen ? "true" : "false");
    quickChatTargetReadout.textContent = quickChatRecipient
      ? `发送目标：${getSurvivorDisplayName(quickChatRecipient)}`
      : "发送目标：全队";
  }

  function updateHunterPresenceBadge() {
    if (!hunterPresenceBadge) return;
    const visible = selectedRole === PLAYER_ROLE.hunter && matchStarted;
    hunterPresenceBadge.classList.toggle("is-hidden", !visible);
    if (!visible) return;
    hunterPresenceBadge.textContent = `追捕阶数：${getHunterPresenceTierLabel()}`;
  }

  function getHunterPresenceTierLabel() {
    if (isInfiniteSawboneMode()) return "二阶";
    if ((hunter.presenceTier || 0) >= 2) return "二阶";
    if ((hunter.presenceTier || 0) >= 1) return "一阶";
    return "零阶";
  }

  function updateCipherStatusReadout() {
    if (!cipherStatusReadout) return;
    if (isInfiniteSawboneMode()) {
      cipherStatusReadout.textContent = "娱乐模式：无限车移动靶练习";
      return;
    }
    if (isSoulBinderPracticeMode()) {
      cipherStatusReadout.textContent = "娱乐模式：20魂印无限借魂移动靶";
      return;
    }
    const completed = Math.min(REPAIR_REQUIRED, getCompletedRepairCount());
    if (isKiteSimulatorMode()) {
      const bestProgress = getBestRepairProgress();
      cipherStatusReadout.textContent = `牵制模拟器：已修${completed}台 · 最高进度${Math.round(bestProgress * 100)}%`;
      return;
    }
    const remaining = Math.max(0, REPAIR_REQUIRED - completed);
    if (remaining === REPAIR_REQUIRED) {
      cipherStatusReadout.textContent = "五台密码机尚未破译";
    } else if (remaining > 0) {
      cipherStatusReadout.textContent = `还剩${getChineseCount(remaining)}台密码机尚未破译`;
    } else {
      cipherStatusReadout.textContent = "五台密码机已破译，出口可开启";
    }
  }

  function getBestRepairProgress() {
    if (!repairPoints.length) return 0;
    return repairPoints.reduce((best, point) => {
      const progress = point.completed ? 1 : (point.progress || 0);
      return Math.max(best, progress);
    }, 0);
  }

  function getChineseCount(value) {
    return ["零", "一", "二", "三", "四", "五"][value] || String(value);
  }

  function updateSurvivorStatusGrid() {
    if (!survivorStatusGrid) return;
    const survivors = getSurvivors().slice(0, 4);
    const nextHtml = survivors.map((survivor, index) => renderSurvivorStatusCard(survivor, index)).join("");
    if (nextHtml === survivorStatusHtml) return;
    survivorStatusHtml = nextHtml;
    survivorStatusGrid.innerHTML = nextHtml;
  }

  function renderSurvivorStatusCard(survivor, index) {
    const status = getSurvivorHudStatus(survivor);
    const effects = getSurvivorNegativeEffects(survivor);
    const selected = selectedRole === PLAYER_ROLE.hunter && isSoulBinder() && hunter.soulSelectionCandidate === survivor;
    const quickChatSelected = selectedRole === PLAYER_ROLE.survivor && quickChatRecipient === survivor;
    const targeted = hunter.soulSiphonTarget === survivor && performance.now() < (hunter.soulSiphonUntil || 0);
    const effectHtml = effects.length
      ? effects.map((effect) => `<span>${escapeHtml(effect)}</span>`).join("")
      : "<em></em>";
    return `
      <div class="survivor-status-card state-${status.key}${selected || quickChatSelected ? " is-selected" : ""}${targeted ? " is-targeted" : ""}" data-survivor-index="${index}">
        <div class="survivor-figure" aria-hidden="true">
          <span class="figure-head"></span>
          <span class="figure-body"></span>
          <span class="figure-arm left"></span>
          <span class="figure-arm right"></span>
          <span class="figure-leg left"></span>
          <span class="figure-leg right"></span>
          <span class="figure-chair"></span>
        </div>
        <div class="survivor-meta">
          <strong>${escapeHtml(getSurvivorDisplayName(survivor))}</strong>
          <span>${escapeHtml(status.label)}</span>
        </div>
        <div class="negative-effects" aria-label="负面状态">${effectHtml}</div>
      </div>
    `;
  }

  function getSurvivorHudStatus(survivor) {
    if (survivor.escaped) return { key: "escaped", label: "已逃出" };
    if (survivor.state === "eliminated") return { key: "eliminated", label: "淘汰" };
    if (survivor.state === "seated") return { key: "seated", label: "挂椅" };
    if (survivor.state === "carried") return { key: "carried", label: "牵起" };
    if (survivor.state === "downed") return { key: "downed", label: "倒地" };
    if (survivor.state === "injured") return { key: "injured", label: "受伤" };
    return { key: "healthy", label: "健康" };
  }

  function getSurvivorNegativeEffects(survivor) {
    const now = performance.now();
    const effects = [];
    if (now < (survivor.edictStunnedUntil || 0)) effects.push("封界眩晕");
    if (now < (survivor.houndStunnedUntil || 0)) effects.push("猎犬眩晕");
    if (now < (survivor.hammerVaultLockedUntil || 0)) effects.push("震荡失衡");
    if (getEdictViolationStacks(survivor) > 0) effects.push(`违令${getEdictViolationStacks(survivor)}`);
    if (now < (survivor.edictHookSlowUntil || 0)) effects.push("翻越迟缓");
    if (now < (survivor.shackledUntil || 0)) effects.push("枷锁");
    else if ((survivor.shackleValue || 0) > 0) effects.push(`枷锁${Math.round(survivor.shackleValue)}`);
    if (getDamageProgressPercent(survivor) > 0) effects.push(getDamageProgressLabel(survivor));
    if (getSoulMarks(survivor) > 0) effects.push(`魂印${getSoulMarks(survivor)}`);
    if (getDanceErosionStacks(survivor) > 0) effects.push(`侵蚀${getDanceErosionStacks(survivor)}`);
    if (now < (survivor.mirrorBlindUntil || 0)) effects.push("致盲");
    if (now < (survivor.abyssWhisperUntil || 0)) effects.push("低语");
    if (now < (survivor.abyssConfusedUntil || 0)) effects.push("紊乱");
    if (now < (survivor.abyssStaggerUntil || 0)) effects.push("僵直");
    if (getBoneBleedStacks(survivor, now) > 0) effects.push(`流血x${getBoneBleedStacks(survivor, now)}`);
    if (now < (survivor.patrollerHoldUntil || 0)) effects.push("被咬");
    else if (now < (survivor.patrollerSlowUntil || 0)) effects.push("减速");
    if (now < (survivor.borrowedTimeUntil || 0)) {
      effects.push((survivor.borrowedTimePendingDamage || 0) > 0 ? `延伤${getBorrowedTimeSecondsLeft(survivor)}s` : `搏命${getBorrowedTimeSecondsLeft(survivor)}s`);
    }
    if (hasMedicShield(survivor, now)) effects.unshift(`护盾${getMedicShieldSecondsLeft(survivor)}s`);
    if (now < (survivor.medicFirstChaseUntil || 0)) effects.unshift("应急撤离");
    if (now < (survivor.medicAdrenalineUntil || 0)) {
      effects.push((survivor.medicAdrenalinePendingDamage || 0) > 0 ? `延伤${getMedicAdrenalineSecondsLeft(survivor)}s` : `肾上腺素${getMedicAdrenalineSecondsLeft(survivor)}s`);
    } else if ((survivor.medicRescueShockPendingDamage || 0) > 0) {
      effects.push("前线延伤");
    }
    if (survivor.action && survivor.action.kind === "flywheelDash") effects.unshift("飞轮");
    if (survivor.action && survivor.action.kind === "navigationChannelSlide") effects.unshift("航道");
    if (now < (survivor.kneeJerkBoostUntil || 0)) effects.unshift("膝跳");
    if (isGeneralRiding(survivor, now)) {
      const rage = Math.floor(survivor.generalRage || 0);
      effects.unshift(isGeneralRamReady(survivor) ? "骑马·满怒" : (survivor.generalRideWhips || 0) > 0 ? `骑马+${(survivor.generalRideWhips || 0) * 5}% 怒${rage}` : `骑马 怒${rage}`);
    }
    if (selectedRole !== PLAYER_ROLE.hunter && survivor.action && survivor.action.kind === "selfHealing") effects.push(`自愈${Math.round((survivor.healProgress || 0) * 100)}%`);
    if (survivor.stitchPack) effects.push(`针线${getStitchSecondsLeft(survivor)}s`);
    if (isKiteSimulatorMode() && survivor !== player && survivor.action && survivor.action.kind === "repairing") {
      effects.push(`修机${Math.round(survivor.action.point.progress * 100)}%`);
    }
    const fencerStrideMarks = getFencerStrideMarkCount(survivor, now);
    if (fencerStrideMarks > 0) effects.unshift(`健步${fencerStrideMarks}`);
    return effects.slice(0, 3);
  }

  function handleSurvivorStatusPick(event, forceConfirm = false) {
    const card = event.target.closest(".survivor-status-card");
    if (!card) return;
    const index = Number(card.dataset.survivorIndex);
    const survivor = getSurvivors()[index];
    if (!survivor) return;

    if (selectedRole === PLAYER_ROLE.survivor && forceConfirm) {
      event.preventDefault();
      event.stopPropagation();
      quickChatRecipient = survivor !== player && survivor.kind === "ai" && isQuickChatTargetAvailable(survivor) ? survivor : null;
      survivorStatusHtml = "";
      updateSurvivorStatusGrid();
      updateQuickChat();
      showAssistAlert(quickChatRecipient ? `消息目标：${getSurvivorDisplayName(quickChatRecipient)}` : "消息目标：全队", performance.now(), 900);
      return;
    }

    if (selectedRole !== PLAYER_ROLE.hunter || !isSoulBinder() || !hunter.soulSelectionMode) return;
    event.preventDefault();
    event.stopPropagation();
    const now = performance.now();
    const same = hunter.soulSelectionCandidate === survivor && now - (hunter.soulSelectionAt || 0) <= 900;
    hunter.soulSelectionCandidate = survivor;
    hunter.soulSelectionCount = forceConfirm ? 2 : same ? (hunter.soulSelectionCount || 1) + 1 : 1;
    hunter.soulSelectionAt = now;
    if (hunter.soulSelectionCount < 2) {
      showAssistAlert(`再点一次 ${survivor.name}`, now, 900);
      return;
    }
    if (hunter.soulSelectionMode === "siphon") {
      if (!startSoulSiphon(survivor, now)) showAssistAlert("目标没有魂印", now, 900);
      return;
    }
  }

  function updateCooldownPanel() {
    if (!cooldownPanel) return;
    const items = getCooldownItems(performance.now());
    cooldownPanel.innerHTML = items.map((item) => {
      return `
        <div class="cooldown-chip${item.ready ? " is-ready" : " is-cooling"}${item.tone ? ` is-${escapeHtml(item.tone)}` : ""}">
          <span>${escapeHtml(item.key)} · ${escapeHtml(item.name)}</span>
          <strong>${escapeHtml(item.value)}</strong>
        </div>
      `;
    }).join("");
  }

  function getCooldownItems(now) {
    if (!selectedRole) return [{ key: "操作", name: "准备", value: "选择角色", ready: true }];
    const items = [{ key: "操作", name: "按键", value: getControlsLabel(), ready: true }];
    if (selectedRole === PLAYER_ROLE.hunter) {
      const attackCooldown = Math.max(0, hunter.wipeUntil - now, hunter.lastAttackAt + hunter.attackCooldown * 1000 - now);
      const stopAttackCooldown = Math.max(0, (hunter.stopAttackUntil || 0) - now);
      items.push({ key: "J", name: "普攻", value: stopAttackCooldown > 0 ? `止戈${Math.ceil(stopAttackCooldown / 1000)}s` : formatCooldown(attackCooldown), ready: stopAttackCooldown <= 0 && attackCooldown <= 0 });
      if (hunterHasSkill()) items.push(getHunterMainSkillCooldown(now));
      if (isLanternKeeper()) {
        const ghostfireCooldown = getGhostfireCooldownLeft(now);
        items.push({
          key: "E",
          name: "鬼火吞噬",
          value: soulLamps.length === 0 ? "无灯" : formatCooldown(ghostfireCooldown),
          ready: canUseGhostfire(now)
        });
      }
      if (isLanternKeeper() && hunter.presenceTier >= 1) {
        const cooldown = getShadowTeleportCooldownLeft(now);
        items.push({ key: "F", name: "灯影", value: formatCooldown(cooldown), ready: cooldown <= 0 && soulLamps.length > 0 });
      }
      if (isTwinSword()) {
        const primaryCooldown = hunter.twinForm === TWIN_FORM_CHIYIN ? Math.max(0, (hunter.nextTwinShadowLockAt || 0) - now) : 0;
        const secondaryCooldown = hunter.twinForm === TWIN_FORM_CHIYIN ? Math.max(0, (hunter.nextTwinShadowStrikeAt || 0) - now) : 0;
        const dualCooldown = Math.max(0, (hunter.nextTwinDualCastAt || 0) - now);
        items.push({ key: "E", name: getTwinPrimaryLabel(), value: formatCooldown(primaryCooldown), ready: primaryCooldown <= 0 });
        items.push({ key: "R", name: getTwinSecondaryLabel(), value: formatCooldown(secondaryCooldown), ready: secondaryCooldown <= 0 });
        items.push({ key: "F", name: "飞剑", value: String(hunter.twinFlyingSwords || 0), ready: (hunter.twinFlyingSwords || 0) > 0 });
        const dualActive = hunter.presenceTier >= 1 && now < (hunter.twinDualCastUntil || 0);
        items.push({
          key: "G",
          name: "双生之力",
          value: hunter.presenceTier < 1 ? "一阶" : dualActive ? `${Math.ceil((hunter.twinDualCastUntil - now) / 1000)}s · 待发` : formatCooldown(dualCooldown),
          ready: dualActive || hunter.presenceTier >= 1 && dualCooldown <= 0
        });
      }
      if (isSoulBinder()) {
        const borrowCooldown = Math.max(0, (hunter.nextBorrowSoulAt || 0) - now);
        const patrolCooldown = Math.max(0, (hunter.nextSoulPatrolAt || 0) - now);
        const patrolActive = isSoulPatrolActive(now);
        const patrolFloatReady = canActivateSoulPatrolFloat(now);
        items.push({ key: "E", name: "借魂", value: hunter.presenceTier >= 2 ? getTotalSoulMarks() > 0 ? `${getTotalSoulMarks()}层` : borrowCooldown > 0 ? formatCooldown(borrowCooldown) : "无魂" : "二阶", ready: canBorrowSoul(now) });
        items.push({ key: "F", name: "魂巡", value: patrolActive ? `${Math.ceil((hunter.soulPatrolUntil - now) / 1000)}s · 跃${hunter.soulPatrolInstantVaultsLeft || 0}` : patrolFloatReady ? "漂浮待发" : hunter.soulPatrolEmpowered ? "远程强化" : formatCooldown(patrolCooldown), ready: patrolActive || patrolFloatReady || canStartSoulPatrol(now) });
      }
      if (isMirrorGhost()) {
        const lightCooldown = Math.max(0, (hunter.nextMirrorLightAt || 0) - now);
        items.push({ key: "E", name: "镜光", value: hunter.presenceTier >= 1 ? mirrorRifts.length > 0 ? formatCooldown(lightCooldown) : "无裂缝" : "一阶", ready: canUseMirrorLight(now) });
        if (hunter.presenceTier >= 2) items.push({ key: "被动", name: "华镜", value: getMirrorCurtainReadout(now), ready: mirrorCurtains.length > 0 });
      }
      if (isDancer()) {
        const spinCooldown = Math.max(0, (hunter.nextDanceSpinAt || 0) - now);
        items.push({ key: "E", name: "旋步", value: hunter.presenceTier >= 1 ? danceLines.length > 0 ? formatCooldown(spinCooldown) : "无舞线" : "一阶", ready: canUseDanceSpin(now) });
        if (hunter.presenceTier >= 2) {
          const infiniteCooldown = Math.max(0, (hunter.nextInfiniteDanceAt || 0) - now);
          const active = isInfiniteDanceActive(now);
          items.push({ key: "F", name: "无穷舞", value: active ? `${Math.ceil((hunter.infiniteDanceUntil - now) / 1000)}s` : formatCooldown(infiniteCooldown), ready: active || canUseInfiniteDance(now) });
        }
      }
      if (isEdictor()) {
        const hookCooldown = getEdictHookCooldownLeft(now);
        items.push({ key: "E", name: "裁定", value: edictHookAim ? "松手裁定" : formatCooldown(hookCooldown), ready: Boolean(edictHookAim) || canUseEdictHook(now) });
      }
      if (isAbyss()) {
        const formActive = isAbyssForm(now);
        const formCooldown = getAbyssFormCooldownLeft(now);
        const projectionCooldown = getAbyssProjectionCooldownLeft(now);
        const whisperCooldown = getAbyssWhisperCooldownLeft(now);
        items.push({ key: "E", name: formActive ? "深渊投影" : "沉没", value: formActive ? formatCooldown(projectionCooldown) : formCooldown > 0 ? formatCooldown(formCooldown) : `${hunter.abyssValue || 0}/${ABYSS_FORM_COST}`, ready: formActive ? canUseAbyssProjection(now) : canStartAbyssForm(now) });
        items.push({ key: "F", name: "深渊低语", value: hunter.presenceTier < 1 ? "一阶" : formActive ? "人相限定" : formatCooldown(whisperCooldown), ready: canUseAbyssWhisper(now) });
        items.push({ key: "被动", name: "触须感知", value: hunter.abyssSenseTargets && hunter.abyssSenseTargets.length ? `${hunter.abyssSenseTargets.length}个方向` : "无感知", ready: Boolean(hunter.abyssSenseTargets && hunter.abyssSenseTargets.length) });
      }
      if (hasHunterBadge("criticalPoint")) {
        const cooldown = Math.max(0, (hunter.nextCriticalPointAt || 0) - now);
        items.push({ key: "被动", name: "临界点", value: areExitsPowered() ? formatCooldown(cooldown) : "未通电", ready: areExitsPowered() && cooldown <= 0 });
      }
      if (hasHunterAssist()) {
        const assistCooldown = getHunterAssistCooldownLeft(now);
        const shiftValue = activeShiftPortals ? `门${activeShiftPortals.usesLeft} · ${Math.ceil(Math.max(0, activeShiftPortals.until - now) / 1000)}s` : null;
        const excitementValue = hunter.assistSkill === "excitement" && now < (hunter.excitementGuardUntil || 0) ? "免控待发" : null;
        items.push({ key: "L", name: getHunterAssistName(), value: activePatroller ? "控制中" : shiftValue || excitementValue || formatCooldown(assistCooldown), ready: activePatroller || activeShiftPortals || excitementValue || assistCooldown <= 0 });
      }
      if (hasHunterBadge("trumpCard")) {
        items.push({ key: "M", name: "底牌", value: hunter.trumpCardSelecting ? "按1-7" : hunter.trumpCardUsed ? "已用" : "可切换", ready: hunter.trumpCardSelecting || !hunter.trumpCardUsed });
      }
      return items;
    }

    items.push({ key: "E", name: getSurvivorUseButtonLabel(), value: "交互", ready: true });
    if (hasSurvivorSkill(player)) items.push(getSurvivorMainSkillCooldown(now));
    if (isFighter(player)) {
      const punching = player.action && player.action.kind === "fighterPunch";
      const cooldown = getFighterPunchCooldownLeft(player, now);
      const preparing = isFighterArenaPreparing(now);
      items.push({ key: "J", name: "破缚拳", value: punching ? player.action.arena ? "擂台后摇" : "蓄力中" : preparing ? `准备${Math.ceil((fighterArena.prepareUntil - now) / 1000)}秒` : isFighterArenaParticipant(player) ? "无冷却" : formatCooldown(cooldown), ready: punching || !preparing && (isFighterArenaParticipant(player) || cooldown <= 0) });
    }
    if (isShieldBearer(player)) {
      const toughnessCooldown = Math.max(0, (player.nextShieldToughnessAt || 0) - now);
      items.push({ key: "被动", name: "坚强", value: formatCooldown(toughnessCooldown), ready: toughnessCooldown <= 0 });
    }
    if (isAntiqueDealer(player)) {
      restoreAntiqueFluteDurability(player, now);
      const recoveryLeft = getAntiqueFluteRecoveryLeft(player, now);
      items.push({
        key: "耐久",
        name: "机关箫",
        value: recoveryLeft > 0 ? `恢复${Math.ceil(recoveryLeft / 1000)}s` : `${Math.floor(player.antiqueDurability || 0)}/${ANTIQUE_FLUTE_DURABILITY_MAX}`,
        ready: recoveryLeft <= 0
      });
      [
        [1, "扫式"],
        [2, "点刺"],
        [3, "抡式"],
        [4, "云门跳跃"],
        [5, "转式加速"]
      ].forEach(([key, name]) => {
        const cooldown = getAntiqueSkillCooldownLeft(player, key, now);
        const active = key === 5 && now < (player.antiqueSprintUntil || 0);
        const value = active ? `${Math.ceil((player.antiqueSprintUntil - now) / 1000)}s` : recoveryLeft > 0 ? `恢复${Math.ceil(recoveryLeft / 1000)}s` : player.antiqueFluteOpen ? formatCooldown(cooldown) : "收起";
        items.push({ key: String(key), name, value, ready: player.antiqueFluteOpen && (active || cooldown <= 0) });
      });
    }
    if (isNavigator(player)) {
      const channel = getNavigatorOwnNavigationChannel(player, now);
      const cooldown = getNavigationChannelRideCooldownLeft(player, now);
      items.push({ key: "E", name: "借道", value: channel ? formatCooldown(cooldown) : "无航道", ready: canUseNavigationChannelRide(player, now) });
    }
    if (hasSurvivorBadge(player, "flywheel")) {
      const cooldown = getFlywheelCooldownLeft(player, now);
      const active = player.action && player.action.kind === "flywheelDash";
      items.push({ key: "L", name: "飞轮", value: active ? "冲刺中" : formatCooldown(cooldown), ready: active || cooldown <= 0 });
    }
    if (isActor(player)) items.push({ key: "F", name: "魔术选项", value: player.magicShowMode === "hunter" ? "送监管" : "转椅", ready: true });
    if (isActor(player)) {
      const cooldown = getRescuePhantomCooldownLeft(player, now);
      items.push({ key: "M", name: "救援幻影", value: formatCooldown(cooldown), ready: canUseActorRescuePhantom(player, now) });
    }
    return items;
  }

  function getHunterMainSkillCooldown(now) {
    if (isHoundMaster()) {
      const cooldown = getHoundCooldownLeft(now);
      return { key: "Q", name: "放犬", value: huntingHounds.length > 0 ? "追猎中" : formatCooldown(cooldown), ready: huntingHounds.length > 0 || canReleaseHound(now) };
    }
    if (isHammerer()) {
      const cooldown = getHammerCooldownLeft(now);
      const action = hunter.action;
      const value = action && action.kind === "hammerCharge" ? `蓄力${Math.round(getHammerChargeRatio(action, now) * 100)}%` : action && action.kind === "hammerLeap" ? "跃击中" : formatCooldown(cooldown);
      return { key: "Q", name: "震荡锤", value, ready: Boolean(action && (action.kind === "hammerCharge" || action.kind === "hammerLeap")) || canStartHammerShock(now) };
    }
    if (isEdictor()) {
      const cooldown = getEdictTrapCooldownLeft(now);
      return { key: "Q", name: "封界", value: edictTraps.length >= EDICTOR_TRAP_LIMIT ? `已满 ${edictTraps.length}/${EDICTOR_TRAP_LIMIT}` : `${edictTraps.length}/${EDICTOR_TRAP_LIMIT} · ${formatCooldown(cooldown)}`, ready: canPlaceEdictTrap(now) };
    }
    if (isAbyss()) {
      const cooldown = getAbyssTentacleCooldownLeft(now);
      return { key: "Q", name: "深海触须", value: abyssTentacleAim ? "瞄准中" : formatCooldown(cooldown), ready: Boolean(abyssTentacleAim) || canUseAbyssTentacle(now) };
    }
    if (isDancer()) {
      const cooldown = getDanceStepCooldownLeft(now);
      const active = hunter.action && hunter.action.kind === "danceStep";
      const connecting = pendingDanceLine ? Math.max(0, pendingDanceLine.connectAt - now) : 0;
      return { key: "Q", name: "舞点", value: dancePointAim ? "拖拽中" : active ? "起势中" : pendingDanceLine ? `连线中 ${connecting > 0 ? `${(connecting / 1000).toFixed(1)}s` : ""}` : pendingDancePoint ? cooldown > 0 ? `舞点1/2 · ${formatCooldown(cooldown)}` : "舞点1/2" : formatCooldown(cooldown), ready: Boolean(dancePointAim || active || canStartDanceStep(now)) };
    }
    if (isMirrorGhost()) {
      const cooldown = getMirrorCurtainCooldownLeft(now);
      return { key: "Q", name: "镜幕", value: mirrorCurtainAim ? "划线中" : formatCooldown(cooldown), ready: mirrorCurtainAim || canStartMirrorCurtainAim(now) };
    }
    if (isSawbone()) {
      const cooldown = getSawDashCooldownLeft(now);
      return { key: "Q", name: canUseShortSaw(now) ? "短锯" : "拉锯", value: formatCooldown(cooldown), ready: canStartSawDash(now) };
    }
    if (isLanternKeeper()) {
      const cooldown = getSoulLampCooldownLeft(now);
      return { key: "Q", name: canRecallSoulLamp(now) ? "收回灯" : "寄魂灯", value: formatCooldown(cooldown), ready: canPlaceSoulLamp(now) || canRecallSoulLamp(now) };
    }
    if (isSoulBinder()) {
      const cooldown = Math.max(0, (hunter.nextSoulSiphonAt || 0) - now);
      const active = hunter.soulSiphonTarget && now < (hunter.soulSiphonUntil || 0);
      const hasMarks = getSurvivors().some((survivor) => getSoulMarks(survivor) > 0 && !survivor.escaped && survivor.state !== "eliminated");
      return { key: "Q", name: "摄魂", value: hunter.presenceTier < 1 ? "一阶" : active ? `${Math.ceil((hunter.soulSiphonUntil - now) / 1000)}s` : cooldown > 0 ? formatCooldown(cooldown) : hasMarks ? "可用" : "无魂", ready: active || canStartSoulSiphon(now) };
    }
    const cooldown = Math.max(0, (hunter.nextTwinFormAt || 0) - now);
    return { key: "Q", name: hunter.twinForm === TWIN_FORM_CHIYIN ? "切赵" : "切池", value: formatCooldown(cooldown), ready: cooldown <= 0 };
  }

  function getSurvivorMainSkillCooldown(now) {
    if (isFighterArenaParticipant(player)) {
      const cooldown = getFighterArenaStepCooldownLeft(player, now);
      return { key: "Q", name: "跳步", value: cooldown > 0 ? formatCooldown(cooldown) : "前跳2米", ready: cooldown <= 0 && !isFighterArenaPreparing(now) };
    }
    if (isActor(player)) {
      const cooldown = getMagicShowCooldownLeft(player, now);
      return { key: "Q", name: "魔术秀", value: formatCooldown(cooldown), ready: cooldown <= 0 };
    }
    if (isClockmaker(player)) {
      const cooldown = getTimeRewindCooldownLeft(player, now);
      return { key: "Q", name: canActivateTimeRewind(player, now) ? "回溯" : "时光装置", value: canActivateTimeRewind(player, now) ? "可用" : formatCooldown(cooldown), ready: canActivateTimeRewind(player, now) || cooldown <= 0 };
    }
    if (isMessenger(player)) {
      const cooldown = getPackageCooldownLeft(player, now);
      return { key: "Q", name: "邮包", value: formatCooldown(cooldown), ready: cooldown <= 0 };
    }
    if (isNavigator(player)) {
      const cooldown = getNavigationChannelCooldownLeft(player, now);
      const aiming = navigationChannelAim && navigationChannelAim.actor === player;
      return { key: "Q", name: "航道", value: aiming ? navigationChannelAim.phase === "placement" ? "选起点" : "选方向" : formatCooldown(cooldown), ready: aiming || cooldown <= 0 };
    }
    if (isAntiqueDealer(player)) {
      restoreAntiqueFluteDurability(player, now);
      const recoveryLeft = getAntiqueFluteRecoveryLeft(player, now);
      return { key: "Q", name: "机关箫", value: recoveryLeft > 0 ? `恢复${Math.ceil(recoveryLeft / 1000)}s` : player.antiqueFluteOpen ? `耐久${Math.floor(player.antiqueDurability || 0)}` : `耐久${Math.floor(player.antiqueDurability || 0)}`, ready: recoveryLeft <= 0 };
    }
    if (isMedic(player)) {
      const cooldown = getMedicAdrenalineCooldownLeft(player, now);
      const active = now < (player.medicAdrenalineUntil || 0);
      return { key: "Q", name: "肾上腺素", value: active ? `${getMedicAdrenalineSecondsLeft(player)}s` : formatCooldown(cooldown), ready: active || cooldown <= 0 };
    }
    if (isGeneral(player)) {
      const riding = isGeneralRiding(player, now);
      const ramReady = riding && isGeneralRamReady(player);
      const cooldown = riding ? getGeneralWhipCooldownLeft(player, now) : getGeneralRideCooldownLeft(player, now);
      const rage = Math.floor(player.generalRage || 0);
      const value = riding ? ramReady ? "怒气满" : `${getGeneralRideSecondsLeft(player, now)}s · 怒${rage}/${GENERAL_RAGE_MAX}` : formatCooldown(cooldown);
      return { key: "Q", name: ramReady ? "冲撞" : riding ? "鞭策" : "骑马", value, ready: ramReady || cooldown <= 0, tone: ramReady ? "danger" : "" };
    }
    if (isShieldBearer(player)) {
      const active = isShieldBearerGuarding(player, now);
      const cooldown = getShieldGuardCooldownLeft(player, now);
      const value = active ? `${Math.ceil((player.shieldGuardUntil - now) / 1000)}s` : formatCooldown(cooldown);
      return { key: "Q", name: "举盾", value, ready: active || cooldown <= 0 };
    }
    if (isPerfumer(player)) {
      const cooldown = getPerfumeCooldownLeft(player, now);
      return { key: "Q", name: hasPerfumeUltimate(player) ? "幻香大阵" : "迷香", value: cooldown > 0 ? formatCooldown(cooldown) : hasPerfumeUltimate(player) ? "香炉" : `${player.perfumeUltimateCharges || 0}/${PERFUME_ULTIMATE_CHARGES}`, ready: cooldown <= 0 };
    }
    if (isTuner(player)) {
      if (player.action && player.action.kind === "repairing") {
        const resonance = Math.floor(getTunerResonance(player));
        const cooldown = getTunerCipherTuneCooldownLeft(player, now);
        return { key: "Q", name: "谐振校正", value: cooldown > 0 ? formatCooldown(cooldown) : `共振${resonance}/20`, ready: canUseTunerCipherTune(player, now) };
      }
      const cooldown = getTunerEchoCooldownLeft(player, now);
      const resonance = Math.floor(getTunerResonance(player));
      return { key: "Q", name: "回声带", value: cooldown > 0 ? formatCooldown(cooldown) : resonance >= TUNER_ECHO_COST ? `共振${resonance}` : `共振${resonance}/${TUNER_ECHO_COST}`, ready: canUseTunerEcho(player, now) };
    }
    if (isFencer(player)) {
      const cooldown = getFencerLungeCooldownLeft(player, now);
      return { key: "Q", name: "突刺", value: player.fencerLungePreparing ? "松手释放" : player.action && player.action.kind === "fencerLunge" ? player.action.turned ? "突刺中" : "可变向" : formatCooldown(cooldown), ready: player.fencerLungePreparing || cooldown <= 0 || player.action && player.action.kind === "fencerLunge" };
    }
    if (isFighter(player)) {
      const stuns = Math.min(FIGHTER_PUNCH_STUNS_FOR_ARENA, player.fighterPunchStunCount || 0);
      const ready = canStartFighterArena(player, now);
      return { key: "Q", name: "擂台", value: player.fighterArenaUsed ? "已用" : ready ? "可用" : `眩晕${stuns}/${FIGHTER_PUNCH_STUNS_FOR_ARENA}`, ready };
    }
    const stitchCooldown = getStitchPackCooldownLeft(player, now);
    return { key: "Q", name: "针线包", value: stitchCooldown > 0 ? formatCooldown(stitchCooldown) : canPlaceStitchPack(player) ? "可用" : "不可用", ready: canPlaceStitchPack(player) };
  }

  function getControlsLabel() {
    if (selectedRole === PLAYER_ROLE.hunter) {
      return `${isTwinSword() ? "J/Q/E/R/F/T/G" : isSoulBinder() ? "J/Q/E/F/Space" : isDancer() ? "J/Q/E/F/Space" : isAbyss() ? "J/Q/E/F/Space" : isMirrorGhost() ? "J/Q/E/Space" : isEdictor() ? "J/Q/E/Space" : isLanternKeeper() ? "J/Q/E/F/Space" : isSawbone() || isHoundMaster() || isHammerer() ? "J/Q/Space" : "J/Space"}${hasHunterAssist() ? "/L" : ""}${hasHunterBadge("trumpCard") ? "/M" : ""}`;
    }
    const flywheelLabel = hasSurvivorBadge(player, "flywheel") ? "/L" : "";
    return `${isAntiqueDealer(player) ? "E/Q/1-5/Space" : isActor(player) ? "E/Q/F/M/Space" : isFighter(player) ? "E/J/Q/Space" : hasSurvivorSkill(player) ? "E/Q/Space" : "E/Space"}${flywheelLabel}`;
  }

  function formatCooldown(ms) {
    if (ms <= 0) return "可用";
    return `${Math.ceil(ms / 1000)}s`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function updateTouchActions() {
    if (!touchUseButton || !touchInteractButton || !touchAttackButton || !touchSkillButton || !touchShadowButton || !touchActorPhantomButton || !touchGhostfireButton) return;
    const isHunter = selectedRole === PLAYER_ROLE.hunter;
    const isSurvivor = selectedRole === PLAYER_ROLE.survivor;
    touchUseButton.classList.toggle("is-hidden", !(isSurvivor || isHunter && (isTwinSword() || hasHunterAssist() || isMirrorGhost() || isDancer() || isEdictor() || isAbyss())));
    touchAttackButton.classList.toggle("is-hidden", !(isHunter || isSurvivor && isFighter(player)));
    touchSkillButton.classList.toggle("is-hidden", !(isHunter && hunterHasSkill() || isSurvivor && hasSurvivorSkill(player)));
    touchSkillButton.classList.toggle("is-danger", isSurvivor && isGeneral(player) && isGeneralRiding(player) && isGeneralRamReady(player));
    touchShadowButton.classList.toggle("is-hidden", !(isHunter && (isLanternKeeper() && hunter.presenceTier >= 1 || isTwinSword() || isDancer() && hunter.presenceTier >= 2 || isAbyss()) || isSurvivor && (isActor(player) || hasSurvivorBadge(player, "flywheel"))));
    touchActorPhantomButton.classList.toggle("is-hidden", !(isSurvivor && isActor(player)));
    touchGhostfireButton.classList.toggle("is-hidden", !(isHunter && isLanternKeeper()));
    touchInteractButton.classList.toggle("is-hidden", !selectedRole);

    if (isSurvivor) {
      touchUseButton.textContent = getSurvivorUseButtonLabel();
      touchSkillButton.textContent = getSurvivorSkillButtonLabel();
      touchAttackButton.textContent = isFighter(player) ? player.action && player.action.kind === "fighterPunch" ? "出拳中" : isFighterArenaParticipant(player) ? "破缚拳" : getFighterPunchCooldownLeft(player, performance.now()) > 0 ? `${Math.ceil(getFighterPunchCooldownLeft(player, performance.now()) / 1000)}s` : "破缚拳" : "攻击";
      touchShadowButton.textContent = hasSurvivorBadge(player, "flywheel") ? "飞轮" : isActor(player) ? "切换" : "灯影";
      const phantomCooldown = getRescuePhantomCooldownLeft(player, performance.now());
      touchActorPhantomButton.textContent = phantomCooldown > 0 ? `${Math.ceil(phantomCooldown / 1000)}s` : "幻影";
      touchInteractButton.textContent = "板窗";
    } else if (isHunter) {
      const sawLockout = isSawbone() ? getSawAttackLockoutLeft(performance.now()) : 0;
      touchAttackButton.textContent = sawLockout > 0 ? `锁刀${Math.ceil(sawLockout / 1000)}s` : "攻击";
      const now = performance.now();
      touchUseButton.textContent = isTwinSword() ? getTwinPrimaryLabel() : isMirrorGhost() ? getMirrorLightButtonLabel() : isDancer() ? "旋步" : isAbyss() ? isAbyssForm(now) ? getAbyssProjectionCooldownLeft(now) > 0 ? `${Math.ceil(getAbyssProjectionCooldownLeft(now) / 1000)}s` : "投影" : getAbyssFormCooldownLeft(now) > 0 ? `${Math.ceil(getAbyssFormCooldownLeft(now) / 1000)}s` : `${hunter.abyssValue || 0}/${ABYSS_FORM_COST}` : isEdictor() ? edictHookAim ? "松手裁定" : getEdictHookCooldownLeft(now) > 0 ? `${Math.ceil(getEdictHookCooldownLeft(now) / 1000)}s` : "裁定" : getHunterAssistButtonLabel();
      touchSkillButton.textContent = getHunterSkillButtonLabel();
      touchShadowButton.textContent = getHunterShadowButtonLabel();
      touchGhostfireButton.textContent = getGhostfireButtonLabel();
      touchInteractButton.textContent = isTwinSword() ? getTwinSecondaryLabel() : "交互";
    } else {
      touchUseButton.textContent = "使用";
      touchAttackButton.textContent = "攻击";
      touchSkillButton.textContent = "技能";
      touchShadowButton.textContent = "灯影";
      touchActorPhantomButton.textContent = "幻影";
      touchGhostfireButton.textContent = "鬼火吞噬";
      touchInteractButton.textContent = "交互";
    }
  }

  function getHunterSkillButtonLabel() {
    if (isFighterArenaParticipant(hunter)) {
      const cooldown = getFighterArenaStepCooldownLeft(hunter);
      return cooldown > 0 ? `${(cooldown / 1000).toFixed(1)}s` : "跳步";
    }
    if (isHoundMaster()) {
      if (huntingHounds.length > 0) return "追猎中";
      const cooldownLeft = getHoundCooldownLeft(performance.now());
      return cooldownLeft > 0 ? `${Math.ceil(cooldownLeft / 1000)}s` : "放犬";
    }
    if (isHammerer()) {
      const now = performance.now();
      if (hunter.action && hunter.action.kind === "hammerCharge") return `蓄力${Math.round(getHammerChargeRatio(hunter.action, now) * 100)}%`;
      if (hunter.action && hunter.action.kind === "hammerLeap") return "跃击中";
      const cooldownLeft = getHammerCooldownLeft(now);
      return cooldownLeft > 0 ? `${Math.ceil(cooldownLeft / 1000)}s` : "震荡锤";
    }
    if (isEdictor()) {
      const cooldownLeft = getEdictTrapCooldownLeft(performance.now());
      if (edictTraps.length >= EDICTOR_TRAP_LIMIT) return "封界已满";
      return cooldownLeft > 0 ? `${Math.ceil(cooldownLeft / 1000)}s` : "封界";
    }
    if (isAbyss()) {
      const cooldownLeft = getAbyssTentacleCooldownLeft(performance.now());
      return abyssTentacleAim ? "松手触须" : cooldownLeft > 0 ? `${Math.ceil(cooldownLeft / 1000)}s` : "深海触须";
    }
    if (isMirrorGhost()) {
      if (mirrorCurtainAim) return mirrorCurtainAim.start ? "松手成幕" : "划线";
      const cooldownLeft = getMirrorCurtainCooldownLeft(performance.now());
      if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
      return "镜幕";
    }
    if (isTwinSword()) {
      const cooldownLeft = Math.max(0, (hunter.nextTwinFormAt || 0) - performance.now());
      if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
      return hunter.twinForm === TWIN_FORM_CHIYIN ? "切赵" : "切池";
    }
    if (isSawbone()) {
      const now = performance.now();
      if (hunter.action && hunter.action.kind === "sawDash") {
        if (Number.isFinite(hunter.action.durability)) return `耐久${Math.max(0, Math.ceil(hunter.action.durability))}%`;
        return isInfiniteSawboneMode() ? "无限车中" : hunter.action.short ? "短锯中" : "拉锯中";
      }
      if (isInfiniteSawboneMode()) return "无限车";
      if (canUseShortSaw(now)) return "短锯";
      const cooldownLeft = getSawDashCooldownLeft(now);
      if (canStartSawDash(now)) return "拉锯";
      if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
      return "拉锯";
    }
    if (isSoulBinder()) {
      const now = performance.now();
      if (hunter.soulSiphonTarget && now < (hunter.soulSiphonUntil || 0)) return "摄魂中";
      const cooldownLeft = Math.max(0, (hunter.nextSoulSiphonAt || 0) - now);
      if (canStartSoulSiphon(now)) return "摄魂";
      if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
      if (getTotalSoulMarks() <= 0) return "无魂";
      return "摄魂";
    }
    if (!isLanternKeeper()) return "技能";
    const now = performance.now();
    if (canRecallSoulLamp(now)) return "收回灯";
    const cooldownLeft = getSoulLampCooldownLeft(now);
    if (canPlaceSoulLamp(now)) return "寄魂灯";
    if (soulLamps.length >= getSoulLampLimit()) return "满灯";
    if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
    return "寄魂灯";
  }

  function getMirrorLightButtonLabel() {
    const now = performance.now();
    if (!isMirrorGhost()) return "使用";
    if (hunter.presenceTier < 1) return "一阶";
    const cooldownLeft = Math.max(0, (hunter.nextMirrorLightAt || 0) - now);
    if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
    if (mirrorRifts.length === 0) return "无裂缝";
    return "镜光";
  }

  function getGhostfireButtonLabel() {
    if (soulLamps.length === 0) return "无灯";
    const cooldownLeft = getGhostfireCooldownLeft(performance.now());
    return cooldownLeft > 0 ? `${Math.ceil(cooldownLeft / 1000)}s` : "鬼火吞噬";
  }

  function getMirrorCurtainReadout(now = performance.now()) {
    if (mirrorCurtains.length === 0) return "无镜幕";
    const remaining = mirrorCurtains.reduce((max, curtain) => Math.max(max, (curtain.until || now) - now), 0);
    return `镜幕${Math.max(0, Math.ceil(remaining / 1000))}s`;
  }

  function getHunterAssistButtonLabel() {
    const now = performance.now();
    if (!hasHunterAssist()) return "使用";
    if (activePatroller) return "收回";
    if (activeShiftPortals) return `门${activeShiftPortals.usesLeft}`;
    if (hunter.assistSkill === "excitement" && performance.now() < (hunter.excitementGuardUntil || 0)) return "免控";
    const cooldownLeft = getHunterAssistCooldownLeft(now);
    if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
    return getHunterAssistName();
  }

  function getHunterShadowButtonLabel() {
    if (isAbyss()) {
      const now = performance.now();
      if (isAbyssForm(now)) return "人相限定";
      if (hunter.presenceTier < 1) return "一阶";
      const cooldown = getAbyssWhisperCooldownLeft(now);
      return cooldown > 0 ? `${Math.ceil(cooldown / 1000)}s` : "深渊低语";
    }
    if (isTwinSword()) return `飞剑${hunter.twinFlyingSwords || 0}`;
    if (isDancer()) {
      const now = performance.now();
      if (hunter.presenceTier < 2) return "二阶";
      if (isInfiniteDanceActive(now)) return `${Math.ceil((hunter.infiniteDanceUntil - now) / 1000)}s`;
      const cooldown = Math.max(0, (hunter.nextInfiniteDanceAt || 0) - now);
      return cooldown > 0 ? `${Math.ceil(cooldown / 1000)}s` : "无穷舞";
    }
    if (isSoulBinder()) {
      const now = performance.now();
      if (isSoulPatrolActive(now)) return `跃${hunter.soulPatrolInstantVaultsLeft || 0}`;
      if (canActivateSoulPatrolFloat(now)) return "漂浮";
      const cooldownLeft = Math.max(0, (hunter.nextSoulPatrolAt || 0) - now);
      if (canStartSoulPatrol(now)) return hunter.soulPatrolEmpowered ? "远程魂巡" : "魂巡";
      if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
      return "魂巡";
    }
    if (!isLanternKeeper()) return "灯影";
    if (hunter.presenceTier < 1) return "未解锁";
    if (isHunterDisplacementBlocked(performance.now())) return "封锁";
    if (canShadowTeleport(performance.now())) return "灯影";
    if (soulLamps.length === 0) return "无灯";
    const cooldownLeft = getShadowTeleportCooldownLeft(performance.now());
    if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
    return "灯影";
  }

  function getTwinPrimaryLabel() {
    if (!isTwinSword()) return "技能一";
    if (hunter.twinForm === TWIN_FORM_QINGTIAN) return hunter.twinTimeMode === "self" ? "时·自身" : "时·求生";
    const cooldownLeft = Math.max(0, (hunter.nextTwinShadowLockAt || 0) - performance.now());
    return cooldownLeft > 0 ? `${Math.ceil(cooldownLeft / 1000)}s` : "影锁";
  }

  function getTwinSecondaryLabel() {
    if (!isTwinSword()) return "技能二";
    if (hunter.twinForm === TWIN_FORM_QINGTIAN) return "空之力";
    const cooldownLeft = Math.max(0, (hunter.nextTwinShadowStrikeAt || 0) - performance.now());
    return cooldownLeft > 0 ? `${Math.ceil(cooldownLeft / 1000)}s` : "影袭";
  }

  function getSurvivorSkillButtonLabel() {
    if (isAntiqueDealer(player)) return player.antiqueFluteOpen ? "收箫" : "机关箫";
    if (isFighter(player)) {
      if (isFighterArenaParticipant(player)) {
        const cooldown = getFighterArenaStepCooldownLeft(player);
        return cooldown > 0 ? `${(cooldown / 1000).toFixed(1)}s` : "跳步";
      }
      const stuns = Math.min(FIGHTER_PUNCH_STUNS_FOR_ARENA, player.fighterPunchStunCount || 0);
      if (player.fighterArenaUsed) return "擂台已用";
      return canStartFighterArena(player) ? "展开擂台" : `眩晕${stuns}/${FIGHTER_PUNCH_STUNS_FOR_ARENA}`;
    }
    if (isActor(player)) {
      const cooldownLeft = getMagicShowCooldownLeft(player, performance.now());
      if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
      return player.magicShowMode === "hunter" ? "送监管" : "转椅";
    }
    if (isClockmaker(player)) {
      const now = performance.now();
      if (canActivateTimeRewind(player, now)) return "回溯";
      const cooldownLeft = getTimeRewindCooldownLeft(player, now);
      if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
      return "时光装置";
    }
    if (isMedic(player)) {
      if (performance.now() < (player.medicAdrenalineUntil || 0)) return "延伤中";
      const cooldownLeft = getMedicAdrenalineCooldownLeft(player, performance.now());
      if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
      return "肾上腺素";
    }
    if (isGeneral(player)) {
      const now = performance.now();
      if (isGeneralRiding(player, now)) {
        if (isGeneralRamReady(player)) return "冲撞";
        const whipCooldown = getGeneralWhipCooldownLeft(player, now);
        return whipCooldown > 0 ? `${Math.ceil(whipCooldown / 1000)}s` : `怒${Math.floor(player.generalRage || 0)}/${GENERAL_RAGE_MAX}`;
      }
      const cooldownLeft = getGeneralRideCooldownLeft(player, now);
      if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
      return "骑马";
    }
    if (isShieldBearer(player)) {
      const now = performance.now();
      if (isShieldBearerGuarding(player, now)) return `${Math.ceil((player.shieldGuardUntil - now) / 1000)}s`;
      const cooldownLeft = getShieldGuardCooldownLeft(player, now);
      return cooldownLeft > 0 ? `${Math.ceil(cooldownLeft / 1000)}s` : "举盾";
    }
    if (isApprentice(player)) return "放针线包";
    if (isNavigator(player)) {
      if (navigationChannelAim && navigationChannelAim.actor === player) return navigationChannelAim.phase === "placement" ? "选起点" : "选方向";
      const cooldownLeft = getNavigationChannelCooldownLeft(player, performance.now());
      return cooldownLeft > 0 ? `${Math.ceil(cooldownLeft / 1000)}s` : "航道";
    }
    if (isPerfumer(player)) {
      const cooldownLeft = getPerfumeCooldownLeft(player, performance.now());
      if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
      return hasPerfumeUltimate(player) ? "香炉" : "迷香";
    }
    if (isTuner(player)) {
      if (player.action && player.action.kind === "repairing") {
        const cooldownLeft = getTunerCipherTuneCooldownLeft(player, performance.now());
        if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
        return getTunerResonance(player) >= 20 ? "谐振校正" : `共振${Math.floor(getTunerResonance(player))}/20`;
      }
      const cooldownLeft = getTunerEchoCooldownLeft(player, performance.now());
      if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
      return getTunerResonance(player) >= TUNER_ECHO_COST ? "回声带" : `共振${Math.floor(getTunerResonance(player))}`;
    }
    if (isFencer(player)) {
      if (player.fencerLungePreparing) return "松手";
      if (player.action && player.action.kind === "fencerLunge") return player.action.turned ? "突刺中" : "变向";
      const cooldownLeft = getFencerLungeCooldownLeft(player, performance.now());
      if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
      return "突刺";
    }
    if (isFighter(player)) {
      if (player.action && player.action.kind === "fighterPunch") return "蓄力中";
      const cooldownLeft = getFighterPunchCooldownLeft(player, performance.now());
      return cooldownLeft > 0 ? `${Math.ceil(cooldownLeft / 1000)}s` : "破缚拳";
    }
    if (!isMessenger(player)) return "技能";
    const cooldownLeft = getPackageCooldownLeft(player, performance.now());
    if (cooldownLeft > 0) return `${Math.ceil(cooldownLeft / 1000)}s`;
    return "邮包";
  }

  function getSurvivorUseButtonLabel() {
    if (player.action && ["dismantlingLamp", "dismantlingPeeper", "dismantlingSoulPatrol"].includes(player.action.kind)) return "停止";
    if (player.action && player.action.kind === "healing") return "停止";
    if (player.action && player.action.kind === "selfHealing") return "停止";
    if (player.action && player.action.kind === "repairing" && player.action.calibration) return "校准";
    if (player.action && player.action.kind === "repairing") return "停止";
    if (player.action && player.action.kind === "openingGate") return "停止";
    if (player.action && player.action.kind === "rescuing") return "停止";
    if (isShieldBearerGuarding(player)) return findNearestSeatedTeammate(player, 96) ? "救人" : "举盾中";
    if (isGeneralRiding(player)) return "下马";
    if (canUseNavigationChannelRide(player)) return "借道";
    if (findNearestHatch(player, 96) && (player.state === "healthy" || player.state === "injured" || player.state === "downed")) return "地窖";
    if (player.state === "downed") return "自愈";
    if (findNearestPeeperWard(player, ASSIST_PEEPER_DISMANTLE_RANGE)) return "拆眼";
    if (findNearestSoulLamp(player, SOUL_LAMP_DISMANTLE_RANGE)) return "拆灯";
    if (findNearestSoulPatrolPoint(player, SOUL_PATROL_DISMANTLE_RANGE)) return "拆魂印";
    if (findNearestSeatedTeammate(player, 96)) return "救人";
    if (areExitsPowered()) {
      const gate = findNearestExitGate(player, GATE_USE_RANGE);
      if (gate) return gate.opened ? "逃出" : "开门";
    }
    if (findNearestHealableTeammate(player, 92)) return "治疗";
    if (findNearestRepairPoint(player, 110)) return "修理";
    return "使用";
  }

  function getSurvivorReadout() {
    if (selectedRole === PLAYER_ROLE.hunter) return getHunterCharacter().name;
    const characterName = getSurvivorCharacter(player).name;
    const label = `${characterName} · ${getSurvivorRoleLabel(player)}${getBadgeReadout(PLAYER_ROLE.survivor, player.badges)}`;
    if (player.escaped) return `${label} · 已逃出`;
    if (isSurvivorInvisible(player)) return `${label} · 隐身`;
    if (performance.now() < (player.abyssConfusedUntil || 0)) return `${label} · 方向紊乱`;
    if (performance.now() < (player.abyssStaggerUntil || 0)) return `${label} · 触须僵直`;
    if (player.action && player.action.kind === "flywheelDash") return `${label} · 飞轮`;
    if (player.action && player.action.kind === "navigationChannelSlide") return `${label} · 航道滑行`;
    if (isActor(player)) return `${label} · ${player.magicShowMode === "hunter" ? "送监管" : "转椅"}`;
    if (isPerfumer(player)) return `${label} · ${hasPerfumeUltimate(player) ? "香炉已点燃" : `迷香${player.perfumeUltimateCharges || 0}/${PERFUME_ULTIMATE_CHARGES}`}`;
    if (isTuner(player)) return `${label} · 共振${Math.floor(getTunerResonance(player))}/${TUNER_RESONANCE_MAX}`;
    if (isFencer(player)) {
      const marks = getFencerStrideMarkCount(player, performance.now());
      if (player.fencerLungePreparing) return `${label} · 突刺准备`;
      if (player.action && player.action.kind === "fencerLunge") return `${label} · 突刺${player.action.turned ? "" : " 可变向"}`;
      if (marks > 0) return `${label} · 健步${marks}`;
    }
    if (isFighter(player)) {
      if (player.action && player.action.kind === "fighterPunch") return `${label} · 破缚拳蓄力`;
      if (isFighterArenaPreparing()) return `${label} · 擂台准备 ${Math.ceil((fighterArena.prepareUntil - performance.now()) / 1000)}秒`;
      if (isFighterArenaParticipant(player)) return `${label} · 擂台 · 我${fighterArena.fighterHealth}/${FIGHTER_ARENA_HUNTER_HEALTH} · 敌${fighterArena.hunterHealth}/${FIGHTER_ARENA_HUNTER_HEALTH}`;
      if (getFighterRescueRushMultiplier(player) > 1) return `${label} · 赶援`;
    }
    if (isGeneralRiding(player)) return `${label} · 骑马 ${getGeneralRideSecondsLeft(player)}秒 · 怒${Math.floor(player.generalRage || 0)}/${GENERAL_RAGE_MAX}${isGeneralRamReady(player) ? " · 冲撞就绪" : ""}`;
    if (isShieldBearerGuarding(player)) return `${label} · 举盾 ${Math.ceil((player.shieldGuardUntil - performance.now()) / 1000)}秒`;
    if (performance.now() < (player.kneeJerkBoostUntil || 0)) return `${label} · 膝跳反射`;
    if (isClockmaker(player) && player.timeDevice) return `${label} · 可回溯`;
    if (hasMedicShield(player)) return `${label} · 护盾`;
    if (performance.now() < (player.medicFirstChaseUntil || 0)) return `${label} · 应急撤离`;
    if (performance.now() < (player.medicAdrenalineUntil || 0)) return `${label} · 肾上腺素 ${getMedicAdrenalineSecondsLeft(player)}秒`;
    if ((player.medicAdrenalinePendingDamage || 0) > 0 || (player.medicRescueShockPendingDamage || 0) > 0) return `${label} · 延伤`;
    if (player.action && player.action.kind === "repairStun") return `${label} · 炸机眩晕`;
    if (player.action && player.action.kind === "repairing" && player.action.calibration) return `${label} · 校准`;
    if (player.action && player.action.kind === "repairing") return `${label} · 修理`;
    if (player.action && player.action.kind === "openingGate") return `${label} · 开门`;
    if (player.action && player.action.kind === "escaping") return `${label} · 逃出`;
    if (player.action && player.action.kind === "healing") return `${label} · 治疗`;
    if (player.action && player.action.kind === "selfHealing") return `${label} · 自愈 ${Math.round((player.healProgress || 0) * 100)}%`;
    if (player.action && player.action.kind === "dismantlingLamp") return `${label} · 拆灯`;
    if (player.action && player.action.kind === "dismantlingPeeper") return `${label} · 拆眼`;
    if (player.action && player.action.kind === "dismantlingSoulPatrol") return `${label} · 拆魂印`;
    if (performance.now() < (player.borrowedTimeUntil || 0)) {
      return `${label} · ${(player.borrowedTimePendingDamage || 0) > 0 ? "延伤" : "搏命"} ${getBorrowedTimeSecondsLeft(player)}秒`;
    }
    if (player.stitchPack) return `${label} · 针线 ${getStitchSecondsLeft(player)}秒`;
    if (performance.now() < (player.shackledUntil || 0)) return `${label} · 枷锁`;
    if ((player.shackleValue || 0) > 0) return `${label} · 枷锁${Math.round(player.shackleValue)}`;
    if (getDamageProgressPercent(player) > 0) return `${label} · ${getDamageProgressLabel(player)}`;
    if (getBoneBleedStacks(player) > 0) return `${label} · 流血x${getBoneBleedStacks(player)}`;
    if (player.state === "downed" && !isBeingPickedUp(player) && getMoveVector().length > 0.1) return `${label} · 爬行`;
    if (performance.now() < player.boostUntil) return `${label} · 加速`;
    return `${label} · ${getStateLabel(player.state)}`;
  }

  function getExitReadout() {
    if (isHatchOpen()) return "地窖开启";
    if (isHatchSpawned()) return "地窖刷新";
    if (!areExitsPowered()) return "未开启";
    const openedCount = exitGates.filter((gate) => gate.opened).length;
    if (openedCount === exitGates.length) return "全开";
    if (openedCount > 0) return `${openedCount}/2`;
    return "可开门";
  }

  function getStateLabel(state) {
    if (state === "healthy") return "健康";
    if (state === "injured") return "受伤";
    if (state === "seated") return "上椅";
    if (state === "carried") return "牵起";
    if (state === "eliminated") return "淘汰";
    return "倒地";
  }

  function updateSharedInteractions(dt) {
    const now = performance.now();
    updateHatchState();
    updateCarryStruggle(dt, now);
    updateSoulBinderSystems(now);
    updateSoulLampAlerts(now);
    updateHunterAssistSystems(dt, now);
    updateAbyssSystems(dt, now);
    updatePackageProjectiles(dt, now);
    updateAbyssTentacles(dt, now);
    updateAbyssProjections(dt, now);
    updateGhostfireProjectiles(dt, now);
    updateEdictSystems(dt, now);
    updateHuntingHounds(dt, now);
    updateHammerShockEffects(now);
    updateTunerEchoLines(now);
    updateStitchPackPickups(now);
    updateStitchPacks(now);
    updateTimeDevices(now);
    updatePerfumeMists(now);
    updateActorDecoys(dt, now);
    updateMirrorNoHeartbeatRifts(now);
    updateMirrorCurtains(now);
    updateDanceLines(now);
    updateMirrorRifts(now);
    updateBoneBleed(now);
    updateBorrowedTime(now);
    updateMedicEffects(now);
    updateGeneralEffects(now, dt);
    updateTunerEffects(dt);
    updateSoulPatrolCipherDecay(now);
    updateAbnormalCipherDecay(now);
    updateRampageBadge(now);
    updateWantedBadge(now);
    updateSawbonePendingWipe(now);
    updateTwinSwordSystems(dt, now);
    updateSharedHealing(dt);
    updateSharedRepairs(dt);
    updateSharedGateOpening(dt);
    updateBleedOutProgress(now);
    updateChairProgress(dt, now);
    updateUnlockTaskRuntime(now, dt);
  }

  function updateAbnormalCipherDecay(now) {
    repairPoints.forEach((point) => {
      if (!point.abnormalDecayUntil) return;
      if (point.completed) {
        point.abnormalDecayUntil = 0;
        point.nextAbnormalDecayAt = 0;
        return;
      }
      const nextTickAt = point.nextAbnormalDecayAt || now + ASSIST_ABNORMAL_DECAY_INTERVAL;
      const lastTickAt = Math.min(now, point.abnormalDecayUntil);
      if (lastTickAt >= nextTickAt) {
        const ticks = Math.floor((lastTickAt - nextTickAt) / ASSIST_ABNORMAL_DECAY_INTERVAL) + 1;
        point.progress = Math.max(0, (point.progress || 0) - ticks * ASSIST_ABNORMAL_DECAY_STEP);
        point.nextAbnormalDecayAt = nextTickAt + ticks * ASSIST_ABNORMAL_DECAY_INTERVAL;
      }
      if (now >= point.abnormalDecayUntil) {
        point.abnormalDecayUntil = 0;
        point.nextAbnormalDecayAt = 0;
      }
    });
  }

  function updateSoulPatrolCipherDecay(now) {
    repairPoints.forEach((point) => {
      if (!point.soulPatrolDecayUntil) return;
      if (point.completed) {
        point.soulPatrolDecayUntil = 0;
        point.nextSoulPatrolDecayAt = 0;
        return;
      }
      const nextTickAt = point.nextSoulPatrolDecayAt || now + SOUL_PATROL_EMPOWERED_DECAY_INTERVAL;
      const lastTickAt = Math.min(now, point.soulPatrolDecayUntil);
      if (lastTickAt >= nextTickAt) {
        const ticks = Math.floor((lastTickAt - nextTickAt) / SOUL_PATROL_EMPOWERED_DECAY_INTERVAL) + 1;
        point.progress = Math.max(0, (point.progress || 0) - ticks * SOUL_PATROL_EMPOWERED_DECAY_STEP);
        point.nextSoulPatrolDecayAt = nextTickAt + ticks * SOUL_PATROL_EMPOWERED_DECAY_INTERVAL;
      }
      if (now >= point.soulPatrolDecayUntil) {
        point.soulPatrolDecayUntil = 0;
        point.nextSoulPatrolDecayAt = 0;
      }
    });
  }

  function updateRampageBadge(now) {
    if (!hasHunterBadge("rampage")) return;
    if ((hunter.rampagePresenceGained || 0) >= RAMPAGE_PRESENCE_MAX_HITS) return;
    if ((hunter.presenceHits || 0) >= PRESENCE_TIER_TWO_HITS) return;
    if (!hunter.nextRampageAt) hunter.nextRampageAt = now + RAMPAGE_FIRST_PRESENCE_DELAY;
    if (now < hunter.nextRampageAt) return;
    hunter.rampagePresenceGained = (hunter.rampagePresenceGained || 0) + 1;
    addHunterPresenceHit(now);
    hunter.nextRampageAt = now + RAMPAGE_PRESENCE_INTERVAL;
    showAssistAlert("张狂 存在感+1", now, 1200);
  }

  function updateWantedBadge(now) {
    const target = hunter.wantedTarget;
    if (!target) return;
    if (
      !hasHunterBadge("wanted") ||
      now >= (hunter.wantedUntil || 0) ||
      target.escaped ||
      target.state === "eliminated" ||
      target.state === "seated" ||
      target.state === "carried"
    ) {
      hunter.wantedTarget = null;
      hunter.wantedUntil = 0;
    }
  }

  function updateSoulBinderSystems(now) {
    if (!isSoulBinder()) return;
    if (hunter.soulSiphonTarget && now >= (hunter.soulSiphonUntil || 0)) {
      hunter.soulSiphonTarget = null;
      hunter.soulSiphonUntil = 0;
      hunter.soulSiphonPenaltyUntil = now + SOUL_SIPHON_FAIL_DURATION;
      showAssistAlert("摄魂落空", now, 1000);
    }
    if (now >= (hunter.borrowSoulUntil || 0)) {
      hunter.borrowSoulSpeedBonus = 0;
      hunter.borrowSoulRecoveryBonus = 0;
    }
  }

  function updateSoulLampAlerts(now) {
    if (!isLanternKeeper() || soulLamps.length === 0) {
      if (lanternAlert && lanternAlert.kind === "detected") lanternAlert = null;
      return;
    }

    soulLamps.forEach((lamp) => {
      const detected = getSurvivors().find((survivor) => {
        if (survivor.escaped || survivor.state === "eliminated" || survivor.state === "seated" || survivor.state === "carried") return false;
        return distanceBetween(survivor, lamp) <= SOUL_LAMP_RANGE;
      });
      if (!detected || now - lamp.lastAlertAt < SOUL_LAMP_ALERT_COOLDOWN) return;

      lamp.lastAlertAt = now;
      lamp.detectingUntil = now + SOUL_LAMP_DETECT_FLASH;
      lanternAlert = {
        kind: "detected",
        text: `魂灯发现 ${detected.name}`,
        lamp,
        survivor: detected,
        until: now + SOUL_LAMP_ALERT_DURATION
      };
      chasePulseUntil = now + 360;
    });

    if (lanternAlert && now >= lanternAlert.until) lanternAlert = null;
  }

  function updateHunterAssistSystems(dt, now) {
    updateAssistShiftPortals(now);

    for (let index = assistPeeperWards.length - 1; index >= 0; index -= 1) {
      const ward = assistPeeperWards[index];
      if (now >= ward.until) {
        assistPeeperWards.splice(index, 1);
        continue;
      }
      getSurvivors().forEach((survivor) => {
        if (survivor.escaped || survivor.state === "eliminated" || survivor.state === "seated") return;
        if (distanceBetween(survivor, ward) > ASSIST_PEEPER_RANGE) return;
        if (!ward.triggered[survivor.name]) {
          ward.triggered[survivor.name] = true;
          revealSurvivorByAssist(survivor, now, 3800);
          showAssistAlert(`插眼发现 ${survivor.name}`, now, 1100);
        }
      });
    }

    if (!activePatroller) return;
    if (now >= activePatroller.until) {
      activePatroller = null;
      return;
    }
    const target = getSurvivors().find((survivor) => {
      if (survivor.escaped || survivor.state === "eliminated" || survivor.state === "seated" || survivor.state === "carried") return false;
      return distanceBetween(survivor, activePatroller) <= ASSIST_PATROLLER_HIT_RANGE + survivor.radius;
    });
    if (!target) return;
    if (isFlywheelActive(target, now)) {
      activePatroller = null;
      showAssistAlert("飞轮规避巡视者", now, 650);
      return;
    }
    if (tryBlockShieldBearerNegativeStatus(target, now, "巡视者")) {
      activePatroller = null;
      return;
    }
    target.patrollerHoldUntil = now + ASSIST_PATROLLER_HOLD_DURATION;
    target.patrollerSlowUntil = target.patrollerHoldUntil + ASSIST_PATROLLER_SLOW_DURATION;
    revealSurvivorByAssist(target, now, ASSIST_PATROLLER_SLOW_DURATION);
    activePatroller = null;
    showAssistAlert(`巡视者咬中 ${target.name}`, now, 1400);
  }

  function updateAssistShiftPortals(now) {
    if (!activeShiftPortals) return;
    if (now >= activeShiftPortals.until) {
      showAssistAlert("移形门关闭", now, 1000);
      finishAssistShift(now);
      return;
    }

    const portals = [activeShiftPortals.near, activeShiftPortals.far];
    const triggerDistance = ASSIST_SHIFT_RADIUS + hunter.radius + ASSIST_SHIFT_TRIGGER_RANGE;
    const nearPortal = portals.find((portal) => distanceBetween(hunter, portal) <= triggerDistance);
    if (!activeShiftPortals.armed) {
      if (!nearPortal) activeShiftPortals.armed = true;
      return;
    }
    if (!nearPortal || now < activeShiftPortals.lockoutUntil) return;
    teleportHunterThroughShiftPortal(nearPortal, now);
  }

  function updateHatchState() {
    hatch.spawned = getCompletedRepairCount() >= HATCH_REPAIR_REQUIRED;
    hatch.opened = hatch.spawned && getActiveSurvivors().length === 1;
  }

  function updateBoneBleed(now) {
    getSurvivors().forEach((survivor) => pruneBoneBleed(survivor, now));
  }

  function updateTimeDevices(now) {
    getSurvivors().forEach((survivor) => {
      if (survivor.timeDevice && now > survivor.timeDevice.until) survivor.timeDevice = null;
      if (hunter.target === survivor && isSurvivorInvisible(survivor, now)) hunter.target = null;
    });
  }

  function updateActorDecoys(dt, now) {
    for (let index = actorDecoys.length - 1; index >= 0; index -= 1) {
      const decoy = actorDecoys[index];
      if (now >= decoy.until) {
        if (decoy.kind === "actorRescuePhantom" && decoy.action && decoy.action.kind === "rescuing" && decoy.action.target && decoy.action.target.chair) {
          decoy.action.target.chairProgressPausedUntil = 0;
        }
        actorDecoys.splice(index, 1);
        continue;
      }
      if (decoy.kind === "actorRescuePhantom") updateActorRescuePhantom(decoy, dt, now);
      else updateSmartDecoy(decoy, dt, now);
    }
  }

  function getActorRescuePhantomTarget(phantom) {
    return getSurvivors()
      .filter((survivor) => survivor !== phantom.owner && survivor.state === "seated" && survivor.chair && !isBeingRescued(survivor))
      .sort((a, b) => {
        const aUrgency = (a.nextChairEliminates ? -2 : 0) - (a.chairProgress || 0);
        const bUrgency = (b.nextChairEliminates ? -2 : 0) - (b.chairProgress || 0);
        return aUrgency - bUrgency || distanceBetween(phantom, a.chair) - distanceBetween(phantom, b.chair);
      })[0] || null;
  }

  function updateActorRescuePhantom(phantom, dt, now) {
    if (phantom.rescueCompleted) {
      phantom.until = now;
      return;
    }
    if (phantom.action) {
      updateActorAction(phantom, now);
      return;
    }
    const rescueTarget = getActorRescuePhantomTarget(phantom);
    if (rescueTarget && rescueTarget.chair) {
      if (distanceBetween(phantom, rescueTarget.chair) <= 96) {
        startRescue(phantom, rescueTarget, now);
        return;
      }
      const standPoint = findNearestSafePosition(rescueTarget.chair.x + 52, rescueTarget.chair.y + 38, phantom.radius);
      moveActorToPoint(phantom, standPoint.x, standPoint.y, ACTOR_RESCUE_PHANTOM_SPEED, dt, now);
      return;
    }

    const guardTarget = getActorRescuePhantomGuardTarget(phantom, now);
    if (!guardTarget) {
      phantom.vx = 0;
      phantom.vy = 0;
      return;
    }
    const guardPoint = getActorRescuePhantomGuardPoint(guardTarget);
    moveActorToPoint(phantom, guardPoint.x, guardPoint.y, ACTOR_RESCUE_PHANTOM_SPEED, dt, now);
  }

  function getActorRescuePhantomGuardTarget(phantom, now) {
    const target = phantom.guardTarget;
    if (
      target &&
      !target.escaped &&
      (target.state === "healthy" || target.state === "injured") &&
      (hunter.target === target || distanceBetween(hunter, target) <= 260)
    ) return target;
    if (phantom.owner && hunter.target === phantom.owner && now < phantom.until) return phantom.owner;
    return null;
  }

  function updateSmartDecoy(decoy, dt, now) {
    const hunterDistance = distanceBetween(decoy, hunter);
    if (decoy.action) {
      updateActorAction(decoy, now);
      return;
    }
    handleAIInteraction(decoy, now, hunterDistance);
    const destination = getKiteEscapeDestination(decoy, hunterDistance, now);
    const speed = (decoy.speed || ACTOR_DECOY_SPEED) * (hunterDistance < 310 ? 1.08 : 0.96);
    const moved = moveActorToPoint(decoy, destination.x, destination.y, speed, dt, now);
    if (moved < 0.5 && now > decoy.repathAt - 120) {
      decoy.path = [];
      decoy.kiteDecision = null;
      decoy.wanderTarget = pickWanderTarget();
    }
  }

  function updatePerfumeMists(now) {
    for (let index = perfumeMists.length - 1; index >= 0; index -= 1) {
      const mist = perfumeMists[index];
      if (now >= mist.until) {
        perfumeMists.splice(index, 1);
        continue;
      }
      if (!mist.stealthedSurvivors) mist.stealthedSurvivors = new Set();
      getSurvivors().forEach((survivor) => {
        if (survivor === mist.owner || mist.stealthedSurvivors.has(survivor)) return;
        if (survivor.escaped || survivor.state === "downed" || survivor.state === "seated" || survivor.state === "carried" || survivor.state === "eliminated") return;
        if (distanceBetween(survivor, mist) > mist.radius) return;
        mist.stealthedSurvivors.add(survivor);
        survivor.invisibleUntil = Math.max(survivor.invisibleUntil || 0, now + PERFUME_ALLY_STEALTH_DURATION);
        if (hunter.target === survivor) hunter.target = null;
        if (hunter.targetLock === survivor) clearHunterTargetLock();
      });
    }
  }

  function getActiveSurvivors() {
    return getSurvivors().filter((survivor) => !survivor.escaped && survivor.state !== "eliminated");
  }

  function getBleedOutSecondsLeft(survivor) {
    if (!survivor.downedAt) return Math.ceil(BLEED_OUT_DURATION / 1000);
    return Math.max(0, Math.ceil((BLEED_OUT_DURATION - (performance.now() - survivor.downedAt)) / 1000));
  }

  function getStitchSecondsLeft(survivor) {
    if (!survivor.stitchPack) return 0;
    return Math.max(0, Math.ceil((survivor.stitchPack.healAt - performance.now()) / 1000));
  }

  function getBorrowedTimeSecondsLeft(survivor) {
    return Math.max(0, Math.ceil(((survivor && survivor.borrowedTimeUntil || 0) - performance.now()) / 1000));
  }

  function getMedicShieldSecondsLeft(survivor) {
    return Math.max(0, Math.ceil(((survivor && survivor.medicShieldUntil || 0) - performance.now()) / 1000));
  }

  function getMedicAdrenalineSecondsLeft(survivor) {
    return Math.max(0, Math.ceil(((survivor && survivor.medicAdrenalineUntil || 0) - performance.now()) / 1000));
  }

  function updateBleedOutProgress(now) {
    getSurvivors().forEach((survivor) => {
      if (survivor.state !== "downed") return;
      if (isKiteSimulatorMode() && survivor === player) return;
      if (!survivor.downedAt) survivor.downedAt = now;
      if (now - survivor.downedAt >= BLEED_OUT_DURATION) eliminateSurvivor(survivor);
    });
  }

  function updateChairProgress(dt, now = performance.now()) {
    chairs.forEach((item) => {
      const survivor = item.survivor;
      if (!survivor || survivor.state !== "seated") return;
      if (isBeingRescued(survivor) || now < (survivor.chairProgressPausedUntil || 0)) return;
      survivor.chairProgress = Math.min(1, survivor.chairProgress + ((dt * 1000) / CHAIR_ELIMINATION_DURATION) * getHunterBadgeMultiplier("chairSpeed"));
      if (isKiteSimulatorMode() && survivor === player) {
        survivor.chairProgress = Math.min(survivor.chairProgress, 0.99);
        survivor.nextChairEliminates = false;
        return;
      }
      if (survivor.chairProgress >= 1) eliminateSurvivor(survivor);
    });
  }

  function updateStitchPackPickups(now) {
    for (let index = stitchPackDrops.length - 1; index >= 0; index -= 1) {
      const drop = stitchPackDrops[index];
      const target = getSurvivors()
        .filter((survivor) => canReceiveStitchPack(survivor))
        .sort((a, b) => distanceBetween(a, drop) - distanceBetween(b, drop))[0];
      if (!target || distanceBetween(target, drop) > target.radius + STITCH_PACK_PICKUP_RADIUS) continue;
      applyStitchPack(target, now, drop.owner);
      stitchPackDrops.splice(index, 1);
    }
  }

  function updateStitchPacks(now) {
    getSurvivors().forEach((survivor) => {
      if (!survivor.stitchPack) return;
      if (survivor.state !== "injured" || survivor.escaped) {
        survivor.stitchPack = null;
        return;
      }
      if (now < survivor.stitchPack.healAt) return;
      if (survivor.action && survivor.action.kind === "beingHealed") cancelHealing(survivor.action);
      const healer = survivor.stitchPack.owner;
      const retainedDamageProgress = Math.max(0, survivor.damageProgress || 0);
      survivor.state = "healthy";
      survivor.healProgress = 0;
      survivor.damageProgress = retainedDamageProgress;
      survivor.action = null;
      survivor.boostUntil = 0;
      clearOneSoulMark(survivor);
      survivor.stitchPack = null;
      survivor.healDecision = null;
      applyPhysicianBenevolence(healer, survivor, now);
      chasePulseUntil = now + 360;
    });
  }

  function updateSharedHealing(dt) {
    getSurvivors().forEach((target) => {
      if (!target.action || target.action.kind !== "beingHealed" || !isHealableState(target)) return;
      if (hunter.carrying) {
        cancelHealing(target.action);
        target.action = null;
        target.healDecision = null;
        return;
      }
      const healers = getActiveHealers(target);
      if (healers.length === 0) {
        target.action = null;
        return;
      }

      const duration = target.state === "downed" ? HEAL_DOWNED_DURATION : HEAL_INJURED_DURATION;
      const healPower = healers.reduce((total, healer) => total + getSurvivorHealPower(healer), 0);
      target.healProgress = Math.min(1, (target.healProgress || 0) + (dt * 1000 * healPower) / duration);
      if (target.healProgress >= 1) finishHealing(target);
    });
  }

  function updateSharedRepairs(dt) {
    const now = performance.now();
    repairPoints.forEach((point) => {
      if (point.completed) return;
      if (areExitsPowered()) {
        cancelRepairPointWorkers(point);
        return;
      }
      point.workers = getActiveRepairers(point);
      if (point.workers.length === 0) return;

      point.workers.forEach((worker) => {
        if (worker.kind === "ai" && canUseTunerCipherTune(worker)) useTunerCipherTune(worker, now);
      });
      if (point.completed) return;

      const progressGain = point.workers.reduce((total, worker) => {
        addTunerResonance(worker, dt * TUNER_RESONANCE_PER_SECOND);
        return total + ((dt * 1000) / worker.action.duration) * getRepairSpeedMultiplier(worker);
      }, 0);
      const nextProgress = point.progress + progressGain;
      const hasPlayerWorker = point.workers.some((worker) => worker.kind === "player");
      if (!hasPlayerWorker && isFinalCipherPoint(point) && nextProgress >= FINAL_CIPHER_PRIME_PROGRESS && shouldHoldFinalCipherPoint(point, now)) {
        point.progress = FINAL_CIPHER_PRIME_PROGRESS;
        pauseAIRepairers(point);
        return;
      }
      point.progress = Math.min(1, nextProgress);
      if (point.progress >= 1) finishRepair(point);
    });
  }

  function updateSharedGateOpening(dt) {
    exitGates.forEach((gate) => {
      if (!areExitsPowered() || gate.opened) return;
      gate.workers = getActiveGateOpeners(gate);
      if (gate.progress >= 1) finishOpenGate(gate);
    });
  }

  function getActiveRepairers(point) {
    return point.workers.filter((worker) => {
      return worker.action &&
        worker.action.kind === "repairing" &&
        worker.action.point === point &&
        !worker.escaped &&
        worker.state !== "downed" &&
        distanceBetween(worker, point) <= 130;
    });
  }

  function getActiveGateOpeners(gate) {
    return gate.workers.filter((worker) => {
      return worker.action &&
        worker.action.kind === "openingGate" &&
        worker.action.gate === gate &&
        !worker.escaped &&
        worker.state !== "downed" &&
        isActorInGateUseRange(worker, gate);
    });
  }

  function checkMatchResult() {
    if (matchResult) return;
    if (isInfiniteSawboneMode() || isKiteSimulatorMode()) return;

    const survivors = getSurvivors();
    const escapedCount = survivors.filter((survivor) => survivor.escaped).length;
    const eliminatedCount = survivors.filter((survivor) => survivor.state === "eliminated").length;
    const activeSurvivors = survivors.filter((survivor) => !survivor.escaped && survivor.state !== "eliminated");

    if (escapedCount >= 3) {
      endMatch("survivor", "逃生胜利", `${escapedCount} 名逃生者已经逃出`);
      return;
    }

    if (eliminatedCount >= 3 && activeSurvivors.length === 0) {
      endMatch("hunter", "追捕者胜利", `${eliminatedCount} 名逃生者被淘汰`);
      return;
    }

    if (escapedCount === 2 && eliminatedCount >= 2) {
      endMatch("draw", "平局", "2 名逃生者逃出");
      return;
    }

    if (activeSurvivors.length === 0) {
      if (escapedCount === 2) {
        endMatch("draw", "平局", "2 名逃生者逃出");
      } else {
        endMatch("hunter", "追捕者胜利", `${escapedCount} 名逃生者逃出`);
      }
    }
  }

  function endMatch(winner, title, detail) {
    trackHunterFourKillUnlock(winner);
    trackMirrorGhostEndgameUnlock(winner);
    matchResult = { winner, title, detail };
    matchStarted = false;
    getSurvivors().forEach((survivor) => {
      if (survivor.action && ["healing", "beingHealed"].includes(survivor.action.kind)) cancelHealing(survivor.action);
      if (survivor.action && survivor.action.kind === "repairing") cancelRepair(survivor.action);
      if (survivor.action && survivor.action.kind === "openingGate") cancelGateOpen(survivor.action);
      if (survivor.chair) survivor.chair.survivor = null;
      survivor.action = null;
      survivor.vx = 0;
      survivor.vy = 0;
    });
    hunter.action = null;
    hunter.carrying = null;
    hunter.vx = 0;
    hunter.vy = 0;
  }

  function getHunterStatusLabel(status) {
    if (status === "attacking") return "攻击";
    if (status === "cooldown") return "冷却";
    if (status === "downed") return "倒地";
    if (status === "wipe") return "擦刀";
    if (status === "miss") return "空刀";
    if (status === "stunned") return "眩晕";
    if (status === "breaking") return "踩板";
    if (status === "dismantlingChannel") return "拆航道";
    if (status === "vaulting") return "翻越";
    if (status === "pickingUp") return "牵人";
    if (status === "carrying") return "牵起";
    if (status === "toChair") return "找椅";
    if (status === "sawDash") return "拉锯";
    if (status === "shortSaw") return "短锯";
    if (status === "sawHit") return "命中";
    if (status === "abnormal") return "失常";
    if (status === "patrolling") return "巡视";
    if (status === "charging") return "蓄力";
    if (status === "hammerLeap") return "跃击";
    if (status === "allDowned") return "全倒地";
    if (status === "controlled") return "手动";
    return "追击";
  }

  function getHunterPresenceReadout() {
    if (isTwinSword()) {
      const form = hunter.twinForm === TWIN_FORM_CHIYIN ? "池音" : "赵青天";
      const intent = Math.round(hunter.twinIntent || 0);
      const swords = hunter.twinFlyingSwords || 0;
      const enlightened = performance.now() < (hunter.twinEnlightenedUntil || 0) ? " · 万剑" : "";
      const badgeText = getBadgeReadout(PLAYER_ROLE.hunter, hunter.badges);
      const detentionText = isDetentionActive() ? " · 一刀斩" : "";
      if ((hunter.presenceTier || 0) >= 2) return `双生剑仙${badgeText} · ${form} · 二阶 · 剑${intent} · 飞${swords}${enlightened}${detentionText}`;
      if ((hunter.presenceTier || 0) >= 1) return `双生剑仙${badgeText} · ${form} · 一阶 · 剑${intent} · 飞${swords}${enlightened}${detentionText}`;
      return `双生剑仙${badgeText} · ${form} · 剑${intent} · 飞${swords}${enlightened}${detentionText}`;
    }
    if (isInfiniteSawboneMode()) return "娱乐模式 · 锯骨 · 二阶无限车 · 移动靶";
    if (isSoulBinderPracticeMode()) return "娱乐模式 · 引魂师 · 20魂印无限借魂";
    const badgeText = getBadgeReadout(PLAYER_ROLE.hunter, hunter.badges);
    const detentionText = isDetentionActive() ? " · 一刀斩" : "";
    const hits = hunter.presenceHits || 0;
    if (isSoulBinder()) {
      const marks = getTotalSoulMarks();
      const siphon = hunter.soulSiphonTarget && performance.now() < (hunter.soulSiphonUntil || 0) ? ` · 摄${hunter.soulSiphonTarget.name}` : "";
      const borrow = performance.now() < (hunter.borrowSoulUntil || 0) ? ` · 借魂+${Math.round((hunter.borrowSoulSpeedBonus || 0) * 100)}%` : "";
      if ((hunter.presenceTier || 0) >= 2) return `引魂师${badgeText} · 二阶 · 魂${marks}${siphon}${borrow}${detentionText}`;
      if ((hunter.presenceTier || 0) >= 1) return `引魂师${badgeText} · 一阶 ${hits}/${PRESENCE_TIER_TWO_HITS} · 魂${marks}${siphon}${borrow}${detentionText}`;
      return `引魂师${badgeText} · 存在 ${hits}/${PRESENCE_TIER_ONE_HITS} · 魂${marks}${siphon}${borrow}${detentionText}`;
    }
    if (isAbyss()) {
      const now = performance.now();
      const form = isAbyssForm(now) ? ` · 沉没${Math.ceil((hunter.abyssFormUntil - now) / 1000)}s` : " · 人相";
      const value = ` · 深渊${hunter.abyssValue || 0}/${ABYSS_VALUE_MAX}`;
      if ((hunter.presenceTier || 0) >= 2) return `“深渊”${badgeText} · 二阶${value}${form}${detentionText}`;
      if ((hunter.presenceTier || 0) >= 1) return `“深渊”${badgeText} · 一阶 ${hits}/${PRESENCE_TIER_TWO_HITS}${value}${form}${detentionText}`;
      return `“深渊”${badgeText} · 存在 ${hits}/${PRESENCE_TIER_ONE_HITS}${value}${form}${detentionText}`;
    }
    if ((hunter.presenceTier || 0) >= 2) return `${getHunterCharacter().name}${badgeText} · 二阶${detentionText}`;
    if ((hunter.presenceTier || 0) >= 1) return `${getHunterCharacter().name}${badgeText} · 一阶 ${hits}/${PRESENCE_TIER_TWO_HITS}${detentionText}`;
    return `${getHunterCharacter().name}${badgeText} · 存在 ${hits}/${PRESENCE_TIER_ONE_HITS}${detentionText}`;
  }

  function getHunterReadout() {
    const now = performance.now();
    if (lanternAlert && now < lanternAlert.until) return lanternAlert.text;
    if (hunter.carrying) return `挂椅 ${Math.round((hunter.carrying.carryProgress || 0) * 100)}%`;
    if (selectedRole === PLAYER_ROLE.hunter && isSawbone() && getSawAttackLockoutLeft(now) > 0) {
      return `${getHunterPresenceReadout()} · 锁刀${Math.ceil(getSawAttackLockoutLeft(now) / 1000)}s`;
    }
    if (selectedRole === PLAYER_ROLE.hunter && isTwinSword() && now < (hunter.twinDualCastUntil || 0)) {
      return `${getHunterPresenceReadout()} · 双生待发`;
    }
    if (selectedRole === PLAYER_ROLE.hunter && hunter.trumpCardSelecting) return `${getHunterPresenceReadout()} · 底牌按1-7`;
    if (selectedRole === PLAYER_ROLE.hunter && hunterHasSkill()) return `${getHunterPresenceReadout()} · ${getHunterSkillButtonLabel()}`;
    if (selectedRole === PLAYER_ROLE.hunter && hasHunterAssist()) return `${getHunterPresenceReadout()} · L ${getHunterAssistButtonLabel()}`;
    if (selectedRole === PLAYER_ROLE.hunter && canHunterAttack(now)) return `${getHunterPresenceReadout()} · J`;
    if (["wipe", "miss", "stunned", "breaking", "dismantlingChannel", "vaulting", "pickingUp", "sawDash", "shortSaw", "sawHit", "abnormal", "patrolling", "charging", "hammerLeap", "allDowned"].includes(hunter.status)) {
      return `${getHunterPresenceReadout()} · ${getHunterStatusLabel(hunter.status)}`;
    }
    if (hunter.target) return `${getHunterPresenceReadout()} · 追${hunter.target.name}`;
    return `${getHunterPresenceReadout()} · ${getHunterStatusLabel(hunter.status)}`;
  }

  function frame(now) {
    const dt = Math.min(0.033, (now - lastTime) / 1000);
    lastTime = now;
    if (matchStarted) {
      refreshKiteSimulatorPlayerCooldowns(now);
      updateFighterArenaTimer(now);
      recoverActorsFromStuckStates(now);
      movePlayer(dt);
      updateTeammates(dt, now);
      if (selectedRole !== PLAYER_ROLE.hunter) updateAIHunter(now);
      updateSharedInteractions(dt);
      constrainFighterArenaParticipants();
      recoverActorsFromStuckStates(now);
      checkMatchResult();
    }
    updateCamera(dt);
    draw();
    requestAnimationFrame(frame);
  }

  function bindTouchStick() {
    let activePointer = null;

    function setStick(clientX, clientY) {
      const box = touchStick.getBoundingClientRect();
      const centerX = box.left + box.width / 2;
      const centerY = box.top + box.height / 2;
      const max = Math.max(30, Math.min(box.width, box.height) * 0.34);
      let x = clientX - centerX;
      let y = clientY - centerY;
      const length = Math.hypot(x, y);
      if (length > max) {
        x = (x / length) * max;
        y = (y / length) * max;
      }
      input.touchX = x / max;
      input.touchY = y / max;
      touchKnob.style.transform = `translate(${x}px, ${y}px)`;
    }

    function resetStick() {
      activePointer = null;
      input.touchX = 0;
      input.touchY = 0;
      touchKnob.style.transform = "translate(0, 0)";
    }

    touchStick.addEventListener("pointerdown", (event) => {
      activePointer = event.pointerId;
      touchStick.setPointerCapture(activePointer);
      setStick(event.clientX, event.clientY);
    });

    touchStick.addEventListener("pointermove", (event) => {
      if (event.pointerId === activePointer) setStick(event.clientX, event.clientY);
    });

    touchStick.addEventListener("pointerup", resetStick);
    touchStick.addEventListener("pointercancel", resetStick);
  }

  function resetMovementInput() {
    input.up = false;
    input.down = false;
    input.left = false;
    input.right = false;
    input.sprint = false;
    input.touchX = 0;
    input.touchY = 0;
    input.directionKeyMap = {};
    cancelPackageAim();
    cancelEdictHookAim();
    cancelAbyssTentacleAim();
    cancelActorRescuePhantomAim();
    mirrorCurtainAim = null;
    cancelFencerLungePreparation(player);
    if (touchKnob) touchKnob.style.transform = "translate(0, 0)";
  }

  function bindTouchActions() {
    bindTouchUseButton();
    bindTouchButton(touchInteractButton, () => {
      const now = performance.now();
      if (isFighterArenaParticipant(selectedRole === PLAYER_ROLE.hunter ? hunter : player)) return;
      if (selectedRole === PLAYER_ROLE.hunter && isTwinSword()) {
        startTwinAim("secondary", now, null, null, null, false);
        finishTwinAim(now);
        return;
      }
      handlePlayerInteraction(now);
    });
    bindTouchButton(touchGhostfireButton, () => useGhostfire(performance.now()));
    bindTouchActorRescuePhantomButton();
    bindAttackButton();
    bindShadowButton();
    bindSkillButton();
  }

  function bindTouchUseButton() {
    if (!touchUseButton) return;
    touchUseButton.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      const now = performance.now();
      if (isFighterArenaParticipant(selectedRole === PLAYER_ROLE.hunter ? hunter : player)) return;
      if (selectedRole === PLAYER_ROLE.hunter && isAbyss()) {
        if (isAbyssForm(now)) useAbyssProjection(now);
        else startAbyssForm(now);
        return;
      }
      if (selectedRole === PLAYER_ROLE.hunter && isEdictor()) {
        touchUseButton.setPointerCapture(event.pointerId);
        startEdictHookAim(now, event.clientX, event.clientY, event.pointerId, false);
        return;
      }
      if (selectedRole === PLAYER_ROLE.hunter && isTwinSword()) {
        if (hunter.twinForm === TWIN_FORM_QINGTIAN) castTwinPrimaryInstant(now);
        else {
          startTwinAim("primary", now, null, null, null, false);
          finishTwinAim(now);
        }
        return;
      }
      if (selectedRole === PLAYER_ROLE.hunter && hasHunterAssist()) {
        handleHunterAssist(now);
        return;
      }
      handlePlayerUse(now);
    });
    touchUseButton.addEventListener("pointermove", (event) => updateEdictHookAim(event.clientX, event.clientY, event.pointerId));
    touchUseButton.addEventListener("pointerup", (event) => {
      finishEdictHookAim(performance.now(), event.pointerId);
      if (touchUseButton.hasPointerCapture(event.pointerId)) touchUseButton.releasePointerCapture(event.pointerId);
    });
    touchUseButton.addEventListener("pointercancel", (event) => {
      cancelEdictHookAim(event.pointerId);
      if (touchUseButton.hasPointerCapture(event.pointerId)) touchUseButton.releasePointerCapture(event.pointerId);
    });
  }

  function bindTouchButton(button, handler) {
    if (!button) return;
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      handler();
    });
  }

  function bindTouchActorRescuePhantomButton() {
    if (!touchActorPhantomButton) return;
    touchActorPhantomButton.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      touchActorPhantomButton.setPointerCapture(event.pointerId);
      startActorRescuePhantomAim(player, performance.now(), null, null, event.pointerId, false);
    });
    touchActorPhantomButton.addEventListener("pointermove", (event) => {
      updateActorRescuePhantomAim(event.clientX, event.clientY, event.pointerId);
    });
    touchActorPhantomButton.addEventListener("pointerup", (event) => {
      finishActorRescuePhantomAim(performance.now(), event.pointerId);
      if (touchActorPhantomButton.hasPointerCapture(event.pointerId)) touchActorPhantomButton.releasePointerCapture(event.pointerId);
    });
    touchActorPhantomButton.addEventListener("pointercancel", (event) => {
      cancelActorRescuePhantomAim(event.pointerId);
      if (touchActorPhantomButton.hasPointerCapture(event.pointerId)) touchActorPhantomButton.releasePointerCapture(event.pointerId);
    });
  }

  function bindAttackButton() {
    if (!touchAttackButton) return;
    touchAttackButton.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (selectedRole === PLAYER_ROLE.survivor && isFighter(player)) {
        startFighterPunch(player, performance.now());
        return;
      }
      touchAttackButton.setPointerCapture(event.pointerId);
      startHunterAttackPress(performance.now());
    });
    touchAttackButton.addEventListener("pointerup", (event) => {
      if (selectedRole === PLAYER_ROLE.survivor && isFighter(player)) return;
      releaseHunterAttackPress(performance.now());
      if (touchAttackButton.hasPointerCapture(event.pointerId)) touchAttackButton.releasePointerCapture(event.pointerId);
    });
    touchAttackButton.addEventListener("pointercancel", (event) => {
      if (selectedRole === PLAYER_ROLE.survivor && isFighter(player)) return;
      releaseHunterAttackPress(performance.now());
      if (touchAttackButton.hasPointerCapture(event.pointerId)) touchAttackButton.releasePointerCapture(event.pointerId);
    });
  }

  function bindSkillButton() {
    if (!touchSkillButton) return;
    touchSkillButton.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      const arenaActor = selectedRole === PLAYER_ROLE.hunter ? hunter : player;
      if (isFighterArenaParticipant(arenaActor)) {
        useFighterArenaStep(arenaActor, performance.now());
        return;
      }
      if (selectedRole === PLAYER_ROLE.survivor && isAntiqueDealer(player)) {
        toggleAntiqueFlute(player, performance.now());
        return;
      }
      if (selectedRole === PLAYER_ROLE.survivor && (isMessenger(player) || isNavigator(player))) {
        touchSkillButton.setPointerCapture(event.pointerId);
        if (isNavigator(player)) startNavigationChannelAim(player, performance.now(), null, null, event.pointerId, false);
        else startPackageAim(player, performance.now(), null, null, event.pointerId, false);
        return;
      }
      if (selectedRole === PLAYER_ROLE.hunter && isDancer()) {
        touchSkillButton.setPointerCapture(event.pointerId);
        startDancePointAim(performance.now(), null, null, event.pointerId, false);
        return;
      }
      if (selectedRole === PLAYER_ROLE.hunter && isAbyss()) {
        touchSkillButton.setPointerCapture(event.pointerId);
        startAbyssTentacleAim(performance.now(), null, null, event.pointerId, false);
        return;
      }
      if (selectedRole === PLAYER_ROLE.hunter && isHammerer()) {
        touchSkillButton.setPointerCapture(event.pointerId);
        startHammerShock(performance.now());
        return;
      }
      if (selectedRole === PLAYER_ROLE.survivor && isFencer(player)) {
        touchSkillButton.setPointerCapture(event.pointerId);
        prepareFencerLunge(player, performance.now());
        return;
      }
      handlePlayerSkill(performance.now());
    });
    touchSkillButton.addEventListener("pointermove", (event) => {
      updatePackageAim(event.clientX, event.clientY, event.pointerId);
      updateNavigationChannelAim(event.clientX, event.clientY, event.pointerId);
      updateDancePointAim(event.clientX, event.clientY, event.pointerId);
      updateAbyssTentacleAim(event.clientX, event.clientY, event.pointerId);
    });
    touchSkillButton.addEventListener("pointerup", (event) => {
      if (selectedRole === PLAYER_ROLE.survivor && isFencer(player)) {
        releaseFencerLunge(player, performance.now());
        if (touchSkillButton.hasPointerCapture(event.pointerId)) touchSkillButton.releasePointerCapture(event.pointerId);
        return;
      }
      if (selectedRole === PLAYER_ROLE.hunter && isDancer()) {
        finishDancePointAim(performance.now(), event.pointerId);
        if (touchSkillButton.hasPointerCapture(event.pointerId)) touchSkillButton.releasePointerCapture(event.pointerId);
        return;
      }
      if (selectedRole === PLAYER_ROLE.hunter && isAbyss()) {
        finishAbyssTentacleAim(performance.now(), event.pointerId);
        if (touchSkillButton.hasPointerCapture(event.pointerId)) touchSkillButton.releasePointerCapture(event.pointerId);
        return;
      }
      if (selectedRole === PLAYER_ROLE.hunter && isHammerer()) {
        releaseHammerShock(performance.now());
        if (touchSkillButton.hasPointerCapture(event.pointerId)) touchSkillButton.releasePointerCapture(event.pointerId);
        return;
      }
      if (selectedRole === PLAYER_ROLE.survivor && isNavigator(player)) {
        finishNavigationChannelAim(performance.now(), event.pointerId);
        if (touchSkillButton.hasPointerCapture(event.pointerId)) touchSkillButton.releasePointerCapture(event.pointerId);
        return;
      }
      finishPackageAim(performance.now(), event.pointerId);
    });
    touchSkillButton.addEventListener("pointercancel", (event) => {
      if (selectedRole === PLAYER_ROLE.survivor && isFencer(player)) {
        cancelFencerLungePreparation(player);
        if (touchSkillButton.hasPointerCapture(event.pointerId)) touchSkillButton.releasePointerCapture(event.pointerId);
        return;
      }
      if (selectedRole === PLAYER_ROLE.hunter && isDancer()) {
        dancePointAim = null;
        if (touchSkillButton.hasPointerCapture(event.pointerId)) touchSkillButton.releasePointerCapture(event.pointerId);
        return;
      }
      if (selectedRole === PLAYER_ROLE.hunter && isAbyss()) {
        cancelAbyssTentacleAim(event.pointerId);
        if (touchSkillButton.hasPointerCapture(event.pointerId)) touchSkillButton.releasePointerCapture(event.pointerId);
        return;
      }
      if (selectedRole === PLAYER_ROLE.hunter && isHammerer()) {
        releaseHammerShock(performance.now());
        if (touchSkillButton.hasPointerCapture(event.pointerId)) touchSkillButton.releasePointerCapture(event.pointerId);
        return;
      }
      if (selectedRole === PLAYER_ROLE.survivor && isNavigator(player)) {
        cancelNavigationChannelAim(player);
        if (touchSkillButton.hasPointerCapture(event.pointerId)) touchSkillButton.releasePointerCapture(event.pointerId);
        return;
      }
      cancelPackageAim(event.pointerId);
    });
  }

  function bindShadowButton() {
    if (!touchShadowButton) return;
    touchShadowButton.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (isFighterArenaParticipant(selectedRole === PLAYER_ROLE.hunter ? hunter : player)) return;
      if (selectedRole === PLAYER_ROLE.hunter && isTwinSword()) {
        touchShadowButton.setPointerCapture(event.pointerId);
        startTwinAim("sword", performance.now(), event.clientX, event.clientY, event.pointerId, false);
        return;
      }
      if (selectedRole === PLAYER_ROLE.survivor && hasSurvivorBadge(player, "flywheel")) {
        touchShadowButton.setPointerCapture(event.pointerId);
        return;
      }
      handlePlayerShadowSkill(performance.now());
    });
    touchShadowButton.addEventListener("pointermove", (event) => {
      updateTwinAim(event.clientX, event.clientY, event.pointerId);
    });
    touchShadowButton.addEventListener("pointerup", (event) => {
      if (selectedRole === PLAYER_ROLE.survivor && hasSurvivorBadge(player, "flywheel")) {
        startFlywheel(player, performance.now());
        return;
      }
      finishTwinAim(performance.now(), event.pointerId);
    });
    touchShadowButton.addEventListener("pointercancel", (event) => {
      if (twinAim && twinAim.kind === "sword" && twinAim.pointerId === event.pointerId) twinAim = null;
    });
  }

  window.addEventListener("resize", resize);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && characterCodexOverlay && !characterCodexOverlay.classList.contains("is-hidden")) {
      event.preventDefault();
      setCharacterCodexVisible(false);
      return;
    }
    if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
    }
    if (event.target && ["INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
    const code = event.key.toLowerCase();
    if (event.repeat && [" ", "e", "r", "f", "q", "t", "g", "j", "l", "m"].includes(code)) return;
    handleHiddenCharacterUnlockKey(event.key);
    keyToInput(event.key, true);
  });
  window.addEventListener("keyup", (event) => keyToInput(event.key, false));
  window.addEventListener("pointermove", (event) => {
    rememberAimPointer(event.clientX, event.clientY);
    updatePackageAim(event.clientX, event.clientY, event.pointerId);
    updateEdictHookAim(event.clientX, event.clientY, event.pointerId);
    updateAbyssTentacleAim(event.clientX, event.clientY, event.pointerId);
    updateNavigationChannelAim(event.clientX, event.clientY, event.pointerId);
    updateActorRescuePhantomAim(event.clientX, event.clientY, event.pointerId);
    updateTwinAim(event.clientX, event.clientY, event.pointerId);
    updateMirrorCurtainAim(event.clientX, event.clientY, event.pointerId);
    updateDancePointAim(event.clientX, event.clientY, event.pointerId);
  });
  window.addEventListener("pointerdown", (event) => {
    if (dancePointAim) {
      if (event.target !== canvas) return;
      event.preventDefault();
      dancePointAim.pointerId = event.pointerId;
      updateDancePointAim(event.clientX, event.clientY, event.pointerId);
      return;
    }
    if (!mirrorCurtainAim) return;
    if (event.target !== canvas) return;
    event.preventDefault();
    beginMirrorCurtainLine(event.clientX, event.clientY, event.pointerId);
  });
  window.addEventListener("pointerup", (event) => {
    if (dancePointAim) {
      event.preventDefault();
      finishDancePointAim(performance.now(), event.pointerId);
      return;
    }
    if (!mirrorCurtainAim) return;
    event.preventDefault();
    finishMirrorCurtainAim(performance.now(), event.pointerId);
  });
  window.addEventListener("blur", resetMovementInput);
  roleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      pendingMode = null;
      showCharacterSelection(button.dataset.role);
    });
  });
  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.mode === GAME_MODE.infiniteSawbone) startInfiniteSawboneMode();
      if (button.dataset.mode === GAME_MODE.soulBinderPractice) startSoulBinderPracticeMode();
      if (button.dataset.mode === GAME_MODE.kiteSimulator) startKiteSimulatorSetup();
    });
  });
  characterButtons.forEach((button) => {
    button.addEventListener("click", () => selectCharacterForSetup(button.dataset.characterRole, button.dataset.character));
  });
  badgeButtons.forEach((button) => {
    button.addEventListener("click", () => toggleBadgeSelection(button.dataset.badgeRole, button.dataset.badge));
  });
  assistButtons.forEach((button) => {
    button.addEventListener("click", () => selectHunterAssist(button.dataset.assist));
  });
  if (kiteSimulatorNoCooldownButton) {
    kiteSimulatorNoCooldownButton.addEventListener("click", () => {
      kiteSimulatorNoCooldown = !kiteSimulatorNoCooldown;
      updateKiteSimulatorOptions(true);
    });
  }
  if (survivorStatusGrid) {
    survivorStatusGrid.addEventListener("pointerdown", handleSurvivorStatusPick);
    survivorStatusGrid.addEventListener("dblclick", (event) => handleSurvivorStatusPick(event, true));
  }
  if (quickChatToggle) {
    quickChatToggle.addEventListener("click", () => {
      quickChatOpen = !quickChatOpen;
      updateQuickChat();
    });
  }
  if (quickChatMenu) {
    quickChatMenu.addEventListener("click", (event) => {
      const button = event.target.closest("[data-quick-chat]");
      if (!button) return;
      sendQuickChat(button.dataset.quickChat, performance.now());
    });
  }
  if (characterBackButton) characterBackButton.addEventListener("click", backSetupStep);
  if (characterNextButton) characterNextButton.addEventListener("click", advanceSetupStep);
  if (hiddenUnlockForm) hiddenUnlockForm.addEventListener("submit", submitHiddenHunterCode);
  if (characterCodexButton) characterCodexButton.addEventListener("click", () => setCharacterCodexVisible(true));
  if (characterCodexClose) characterCodexClose.addEventListener("click", () => setCharacterCodexVisible(false));
  if (characterCodexOverlay) {
    characterCodexOverlay.addEventListener("pointerdown", (event) => {
      if (event.target === characterCodexOverlay) setCharacterCodexVisible(false);
    });
  }
  if (characterCodexList) {
    characterCodexList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-codex-character]");
      if (!button) return;
      characterCodexCharacterId = button.dataset.codexCharacter;
      renderCharacterCodex();
    });
  }
  characterCodexTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const role = tab.dataset.codexRole;
      if (role !== PLAYER_ROLE.survivor && role !== PLAYER_ROLE.hunter) return;
      characterCodexRole = role;
      characterCodexCharacterId = Object.keys(CHARACTER_GUIDE[role] || {})[0] || "";
      renderCharacterCodex();
    });
  });

  resize();
  bindTouchStick();
  bindTouchActions();
  resetMatch();
  setRoleOverlayVisible(true);
  requestAnimationFrame(frame);
})();
