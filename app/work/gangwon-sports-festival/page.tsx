import { CaseStudy } from "@/app/components/case-study/CaseStudy";

export const metadata = {
  title: "강원특별자치도민 체육대회 포스터 — LATENCY",
  description: "강원특별자치도민이 스포츠를 매개로 하나의 목표를 향해 함께 전진하는 이미지를 담은 포스터.",
};

export default function GangwonSportsFestivalPage() {
  return (
    <CaseStudy
      categoryLabel="Graphic Design"
      year="2025"
      title="강원특별자치도민 체육대회 포스터"
      video="/videos/works/gangwon-sports-festival.mp4"
      description="다양한 종목의 선수들이 하나의 방향으로 역동적으로 나아가는 구도를 통해, 강원특별자치도민이 스포츠를 매개로 하나의 목표를 향해 함께 전진하는 이미지를 표현하였다. 축구, 배구, 테니스, 수영 등 여러 종목을 한 화면에 배치해 종합 체육대회의 규모감과 에너지를 강조하였으며, 상승하는 대각선 구도와 속도감 있는 그래픽 요소로 도전, 화합, 열정을 시각화하였다."
      meta={[
        { label: "ROLE",   value: "Concept · Visual Design" },
        { label: "CLIENT", value: "강원특별자치도" },
        { label: "YEAR",   value: "2025" },
      ]}
    />
  );
}
