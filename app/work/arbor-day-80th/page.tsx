import { CaseStudy } from "@/app/components/case-study/CaseStudy";

export const metadata = {
  title: "식목일 80주년 포스터 — LATENCY",
  description: "광복 80주년과 식목일 80주년이 겹치는 역사적 의미를 담은 포스터.",
};

export default function ArborDay80thPage() {
  return (
    <CaseStudy
      categoryLabel="Graphic Design"
      year="2025"
      title="식목일 80주년 포스터"
      image={{
        src:    "/images/works/arbor-day-80th.png",
        alt:    "식목일 80주년 포스터",
        width:  1980,
        height: 2799,
      }}
      description="광복 80주년과 식목일 80주년이 겹치는 역사적 의미를 담은 포스터다. 안중근 의사의 손에서 자라나는 나무를 통해 '희생을 바탕으로 한 나라의 번영'을 시각적으로 표현하였다. 80이라는 숫자를 손가락의 형상으로 치환하고 그 안에 나무를 중첩시켜 사람과 자연, 역사와 현재의 연결을 담았으며, 지역별 나무심기 적기를 손가락 위에 배치하여 정보 전달과 상징을 동시에 수행하였다."
      meta={[
        { label: "ROLE",   value: "Concept · Visual Design · Information Hierarchy" },
        { label: "CLIENT", value: "산림청" },
        { label: "YEAR",   value: "2025" },
      ]}
    />
  );
}
