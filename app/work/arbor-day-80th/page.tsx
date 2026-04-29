import { CaseStudyLayout, Section, BulletList, MetaTable } from "@/app/components/case-study/CaseStudyLayout";

export const metadata = {
  title: "식목일 80주년 포스터 — LATENCY",
  description:
    "광복 80주년과 식목일 80주년이 겹치는 역사적 의미를 담은 포스터. 안중근 의사의 손에서 자라나는 나무를 통해 희생을 바탕으로 한 나라의 번영을 시각적으로 표현했다.",
};

export default function ArborDay80thPage() {
  return (
    <CaseStudyLayout
      meta={{
        category:     "Graphic Design",
        year:         "2025",
        titleKo:      "식목일 80주년 포스터",
        titleEn:      "Arbor Day 80th Anniversary Poster",
        imageSrc:     "/images/works/arbor-day-80th.png",
        imageAlt:     "식목일 80주년 포스터 — 안중근 의사의 손에서 자라는 나무",
        imageWidth:   1980,
        imageHeight:  2799,
        imageCaption: "산림청 · 2025년 4월 5일 · 제80회 식목일",
      }}
    >
      <Section title="Concept">
        <p>
          광복 80주년과 식목일 80주년이 겹치는 역사적 의미를 담은 포스터.
          안중근 의사의 손에서 자라나는 나무를 통해{" "}
          <em style={{ fontStyle: "italic", color: "var(--fg)" }}>
            '희생을 바탕으로 한 나라의 번영'
          </em>
          을 시각적으로 표현했다.
        </p>
      </Section>

      <Section title="Design Decisions">
        <BulletList items={[
          "80이라는 숫자를 단순한 타이포그래피가 아니라 손가락의 형상으로 치환.",
          "손 안에 나무를 중첩시켜 사람과 자연, 역사와 현재의 연결을 표현.",
          "지역별 나무심기 적기(난대 / 온대 남부·중부·북부)를 손가락 위에 배치하여 정보 전달과 상징을 동시에 수행.",
          "위에서 아래로 이어지는 따뜻한 초록 → 차가운 청록의 그라데이션: 잎(생명, 봄) → 줄기(역사, 시간의 흐름).",
        ]} />
      </Section>

      <Section title="Information Design">
        <p className="mb-6">포스터 한 장 안에 다음 정보를 위계 있게 담음:</p>
        <MetaTable rows={[
          ["메인 메시지", "80주년의 의미"],
          ["부 정보",     "지역별 식목 적기"],
          ["발행처",      "산림청"],
          ["날짜",        "2025년 4월 5일, 제80회 식목일"],
        ]} />
      </Section>

      <Section title="Role">
        <p style={{ color: "var(--fg-muted)" }}>
          Concept · Visual Design · Information Hierarchy
        </p>
      </Section>
    </CaseStudyLayout>
  );
}
