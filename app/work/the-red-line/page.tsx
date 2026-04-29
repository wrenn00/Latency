import { CaseStudy } from "@/app/components/case-study/CaseStudy";

export const metadata = {
  title: "The Red Line — LATENCY",
  description: "폭스바겐 골프 GTI 레드 스트립 50년의 여정을 담은 시네마틱 광고. 베스트 시네마틱 모먼트 상 수상.",
};

export default function TheRedLinePage() {
  return (
    <CaseStudy
      categoryLabel="Advertising Design"
      year="2025"
      title="The Red Line"
      subtitle="폭스바겐 골프 GTI 시네마틱 광고"
      youtubeId="SE9fLMtllAg"
      description="폭스바겐 골프 GTI의 상징인 레드 스트립의 50년간의 변화를 따라가며, 8세대에 이르러 하나의 선으로 완성되는 과정을 강렬한 빨강의 비주얼로 풀어낸 시네마틱 광고다. 레드 스트립은 50년간 매 세대마다 빠짐없이 존재해온 GTI의 디자인 요소로, 이 작은 선 하나에 브랜드의 헤리티지와 퍼포먼스, 아이덴티티가 모두 담겨 있다고 보았으며, 영상은 그 선의 여정을 따라가 마침내 하나로 합쳐진 8세대 모델에 도달한다. '폭스바겐 골프 GTI 대학생 AI 영상 광고 공모전'에서 베스트 시네마틱 모먼트 상을 수상하였다."
      meta={[
        { label: "ROLE",   value: "Concept · Direction · AI Visual Generation · Editing" },
        { label: "CLIENT", value: "Volkswagen Golf GTI 대학생 AI 영상 광고 공모전" },
        { label: "AWARD",  value: "Best Cinematic Moment" },
        { label: "YEAR",   value: "2025" },
      ]}
    />
  );
}
