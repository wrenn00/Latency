import { CaseStudy } from "@/app/components/case-study/CaseStudy";

export const metadata = {
  title: "세계해양포럼 포스터 — LATENCY",
  description: "세계해양포럼의 주제 '초불확실성 시대, 파도를 넘어'를 시각화한 포스터.",
};

export default function WorldOceanForumPage() {
  return (
    <CaseStudy
      categoryLabel="Graphic Design"
      year="2025"
      title="세계해양포럼 포스터"
      subtitle="World Ocean Forum Poster — Beyond a wave of uncertainty"
      image={{
        src:    "/images/works/world-ocean-forum.png",
        alt:    "세계해양포럼 포스터",
        width:  1980,
        height: 2800,
      }}
      description='세계해양포럼의 주제 "초불확실성 시대, 파도를 넘어(Beyond a wave of uncertainty)"를 포스터로 시각화하였다. 지정학적 갈등, 기후위기, 자원경쟁 등 복합적인 글로벌 위기를 거대한 파도로 형상화하고, 그 파도 사이를 향해 나아가는 1인칭 시점을 통해 예측 가능하고 지속 가능한 미래를 향한 돌파구를 상징적으로 표현하였다.'
      meta={[
        { label: "ROLE",   value: "Concept · Visual Design" },
        { label: "CLIENT", value: "World Ocean Forum" },
        { label: "YEAR",   value: "2025" },
      ]}
    />
  );
}
