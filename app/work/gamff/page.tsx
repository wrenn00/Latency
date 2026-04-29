import { CaseStudy } from "@/app/components/case-study/CaseStudy";

export const metadata = {
  title: "GAMFF 포스터 — LATENCY",
  description: "경상북도 AI 메타버스 필름 페스티벌 2026 포스터 디자인.",
};

export default function GamffPage() {
  return (
    <CaseStudy
      categoryLabel="Graphic Design"
      year="2026"
      title="GAMFF 포스터"
      subtitle="경상북도 AI 메타버스 필름 페스티벌 2026"
      image={{
        src:    "/images/works/gamff.jpg",
        alt:    "GAMFF 2026 포스터",
        width:  1980,
        height: 2800,
      }}
      description="2026년에 개최하는 경상북도 AI 메타버스 필름 페스티벌의 포스터 디자인을 하였다. 이 작품은 AI와 메타버스가 확장한 경계 없는 세계 속에서 인간의 존재와 감정, 정체성을 되묻는 시각적 상상이다. 현실과 가상이 교차하는 그 틈에서, 존재는 더 이상 고정되지 않고, 흐르고, 연결되고, 다시 정의된다."
      meta={[
        { label: "ROLE",   value: "Concept · Visual Design" },
        { label: "CLIENT", value: "경상북도 AI 메타버스 필름 페스티벌 (GAMFF)" },
        { label: "YEAR",   value: "2026" },
      ]}
    />
  );
}
