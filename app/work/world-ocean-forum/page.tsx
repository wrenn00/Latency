import { CaseStudyLayout, Section, BulletList, MetaTable } from "@/app/components/case-study/CaseStudyLayout";

export const metadata = {
  title: "세계해양포럼 포스터 — LATENCY",
  description:
    "세계해양포럼의 주제 '초불확실성 시대, 파도를 넘어'를 시각화한 포스터. 복합적 글로벌 위기를 거대한 파도로 형상화하고 1인칭 항해 시점으로 돌파구를 표현했다.",
};

export default function WorldOceanForumPage() {
  return (
    <CaseStudyLayout
      meta={{
        category:     "Graphic Design",
        year:         "2025",
        titleKo:      "세계해양포럼 포스터",
        titleEn:      "World Ocean Forum Poster — Beyond a wave of uncertainty",
        imageSrc:     "/images/works/world-ocean-forum.jpg",
        imageAlt:     "세계해양포럼 포스터 — 파도를 넘어 나아가는 시점",
        imageWidth:   1980,
        imageHeight:  2800,
        imageCaption: "World Ocean Forum · 2025",
      }}
    >
      <Section title="Concept">
        <p>
          세계해양포럼의 주제{" "}
          <em style={{ fontStyle: "italic", color: "var(--fg)" }}>
            "초불확실성 시대, 파도를 넘어 (Beyond a wave of uncertainty)"
          </em>
          를 포스터로 시각화했다. 지정학적 갈등, 기후위기, 자원경쟁 등 복합적인 글로벌 위기를
          '거대한 파도'로 형상화하고, 그 파도 사이를 향해 나아가는 1인칭 시점을 통해
          예측 가능하고 지속 가능한 미래를 향한 돌파구를 상징적으로 표현했다.
        </p>
      </Section>

      <Section title="Design Decisions">
        <BulletList items={[
          "추상적 개념인 '불확실성'을 거대한 파도라는 구체적 자연 현상으로 치환.",
          "관찰자 시점이 아닌 1인칭 항해 시점을 채택하여, 위기를 바라보는 입장이 아닌 '위기 한복판으로 나아가는' 능동적 태도를 시각화.",
          "파도 사이의 좁은 통로(틈)를 화면 중앙에 배치하여 '돌파구'라는 메시지를 자연스럽게 시선의 종착점에 위치시킴.",
          "색채는 깊고 차가운 청색 계열로 통일하여 위기의 긴장감과 바다라는 본 주제를 동시에 환기.",
        ]} />
      </Section>

      <Section title="Symbolism">
        <MetaTable rows={[
          ["파도",          "복합 위기 (지정학·기후·자원)"],
          ["시점",          "항해자, 즉 인류의 능동적 선택"],
          ["파도 사이의 길", "지속 가능한 미래로의 돌파구"],
        ]} />
      </Section>

      <Section title="Role">
        <p style={{ color: "var(--fg-muted)" }}>
          Concept · Visual Design · Symbolic Translation
        </p>
      </Section>
    </CaseStudyLayout>
  );
}
