import {
  BABYS_BREATH_STAGE_IMAGES,
  CAMELLIA_STAGE_IMAGES,
  CHERRY_BLOSSOM_STAGE_IMAGES,
  DAFFODIL_STAGE_IMAGES,
  DAISY_STAGE_IMAGES,
  FREESIA_STAGE_IMAGES,
  IRIS_STAGE_IMAGES,
  LAVENDER_STAGE_IMAGES,
  LILY_STAGE_IMAGES,
  LOTUS_STAGE_IMAGES,
  PEONY_STAGE_IMAGES,
  TULIP_STAGE_IMAGES,
} from '../assets/mission-flowers/stageBundles';

export type FlowerId =
  | 'lily'
  | 'peony'
  | 'babys-breath'
  | 'daffodil'
  | 'lotus'
  | 'lavender'
  | 'camellia'
  | 'iris'
  | 'daisy'
  | 'tulip'
  | 'freesia'
  | 'cherry-blossom';

export type FlowerGroupId = 'life' | 'hope' | 'purity';

export type GrowthStageIndex = 1 | 2 | 3 | 4 | 5;

export interface MissionFlower {
  id: FlowerId;
  emoji: string;
  nameKo: string;
  nameEn: string;
  /** 팝업 문구용 꽃말 두 가지 */
  flowerMeaningsPopup: [string, string];
  /** 카드에 보여 줄 한 줄 설명 */
  hint: string;
  groupId: FlowerGroupId;
  /** 단계별 일러스트(Vite 번들 URL). 없으면 기본 도형 성장 UI */
  stageImages?: readonly [string, string, string, string, string];
}

export const FLOWER_GROUPS: { id: FlowerGroupId; titleKo: string; barClass: string }[] = [
  { id: 'life', titleKo: '생명의 시작을 축하하는 꽃', barClass: 'from-pink-400 to-rose-400' },
  { id: 'hope', titleKo: '기다림과 희망을 전하는 꽃', barClass: 'from-violet-500 to-purple-500' },
  { id: 'purity', titleKo: '아기의 순수함을 닮은 꽃', barClass: 'from-amber-300 to-yellow-400' },
];

export const MISSION_FLOWERS: MissionFlower[] = [
  {
    id: 'lily',
    emoji: '🌿',
    nameKo: '백합',
    nameEn: 'Lily',
    flowerMeaningsPopup: ['순수', '탄생'],
    hint: '아기 탄생이나 임신 축하에 가장 많이 쓰이는 꽃',
    groupId: 'life',
    stageImages: LILY_STAGE_IMAGES,
  },
  {
    id: 'peony',
    emoji: '🌸',
    nameKo: '모란',
    nameEn: 'Peony',
    flowerMeaningsPopup: ['풍요', '다산'],
    hint: '“아이 많이 낳는 꽃”이라는 의미로 동양에서 특히 강함',
    groupId: 'life',
    stageImages: PEONY_STAGE_IMAGES,
  },
  {
    id: 'babys-breath',
    emoji: '🌼',
    nameKo: '안개꽃',
    nameEn: "Baby's Breath",
    flowerMeaningsPopup: ['순수한 사랑', '아기 같은 순수함'],
    hint: '출산 선물 꽃다발에 거의 필수',
    groupId: 'life',
    stageImages: BABYS_BREATH_STAGE_IMAGES,
  },
  {
    id: 'daffodil',
    emoji: '🌼',
    nameKo: '수선화',
    nameEn: 'Daffodil',
    flowerMeaningsPopup: ['재탄생', '새로운 시작'],
    hint: '봄과 생명의 시작을 상징',
    groupId: 'life',
    stageImages: DAFFODIL_STAGE_IMAGES,
  },
  {
    id: 'lotus',
    emoji: '🌸',
    nameKo: '연꽃',
    nameEn: 'Lotus',
    flowerMeaningsPopup: ['고난 속에서 피어나는 생명', '희망'],
    hint: '난임을 겪는 분들에게 의미 있는 상징',
    groupId: 'hope',
    stageImages: LOTUS_STAGE_IMAGES,
  },
  {
    id: 'lavender',
    emoji: '💜',
    nameKo: '라벤더',
    nameEn: 'Lavender',
    flowerMeaningsPopup: ['치유', '안정'],
    hint: '마음을 다스리고 기다림의 시간을 상징',
    groupId: 'hope',
    stageImages: LAVENDER_STAGE_IMAGES,
  },
  {
    id: 'camellia',
    emoji: '🌺',
    nameKo: '동백꽃',
    nameEn: 'Camellia',
    flowerMeaningsPopup: ['인내', '기다림'],
    hint: '오랜 기다림과 헌신의 의미',
    groupId: 'hope',
    stageImages: CAMELLIA_STAGE_IMAGES,
  },
  {
    id: 'iris',
    emoji: '🌿',
    nameKo: '아이리스',
    nameEn: 'Iris',
    flowerMeaningsPopup: ['희망', '좋은 소식'],
    hint: '“곧 좋은 일이 생긴다”는 의미로 많이 사용',
    groupId: 'hope',
    stageImages: IRIS_STAGE_IMAGES,
  },
  {
    id: 'daisy',
    emoji: '🌼',
    nameKo: '데이지',
    nameEn: 'Daisy',
    flowerMeaningsPopup: ['순수함', '천진난만함'],
    hint: '아기의 이미지와 가장 가까운 꽃',
    groupId: 'purity',
    stageImages: DAISY_STAGE_IMAGES,
  },
  {
    id: 'tulip',
    emoji: '🌷',
    nameKo: '튤립',
    nameEn: 'Tulip',
    flowerMeaningsPopup: ['사랑', '새로운 시작'],
    hint: '연한 색은 따뜻한 사랑과 탄생 의미',
    groupId: 'purity',
    stageImages: TULIP_STAGE_IMAGES,
  },
  {
    id: 'freesia',
    emoji: '🌸',
    nameKo: '프리지아',
    nameEn: 'Freesia',
    flowerMeaningsPopup: ['순수', '새로운 출발'],
    hint: '출산·임신 축하 꽃으로 잘 쓰임',
    groupId: 'purity',
    stageImages: FREESIA_STAGE_IMAGES,
  },
  {
    id: 'cherry-blossom',
    emoji: '🌸',
    nameKo: '벚꽃',
    nameEn: 'Cherry Blossom',
    flowerMeaningsPopup: ['짧지만 아름다운 생명', '시작'],
    hint: '생명의 소중함을 강조할 때',
    groupId: 'purity',
    stageImages: CHERRY_BLOSSOM_STAGE_IMAGES,
  },
];

export const GROWTH_STAGE_LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: '씨앗',
  2: '발아',
  3: '성장',
  4: '꽃봉오리',
  5: '개화',
};

const flowerById = Object.fromEntries(MISSION_FLOWERS.map((f) => [f.id, f])) as Record<
  FlowerId,
  MissionFlower
>;

export function pickRandomMissionFlowerId(): FlowerId {
  const idx = Math.floor(Math.random() * MISSION_FLOWERS.length);
  return MISSION_FLOWERS[idx]!.id;
}

export function getMissionFlower(id: FlowerId): MissionFlower {
  return flowerById[id] ?? MISSION_FLOWERS[0];
}

export function getMissionFlowerStageImageSrc(
  flower: MissionFlower,
  stage: GrowthStageIndex,
): string | undefined {
  const imgs = flower.stageImages;
  if (!imgs) return undefined;
  return imgs[stage - 1];
}
