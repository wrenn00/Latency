import { CaseStudy } from "@/app/components/case-study/CaseStudy";

export const metadata = {
  title: "EnC — LATENCY",
  description: "영화 〈찰리와 초콜릿 공장〉 모티프의 엔딩크레딧 타이포그래픽 포스터.",
};

export default function EncTypographyPage() {
  return (
    <CaseStudy
      categoryLabel="Graphic Design"
      year="2025"
      title="EnC"
      subtitle="엔딩크레딧 타이포그래픽 포스터"
      image={{ src: "/images/works/chocolate.png", alt: "EnC 엔딩크레딧 타이포그래픽 포스터 — 찰리와 초콜릿 공장 모티프", width: 6104, height: 8641 }}
      description="EnC는 영화 〈찰리와 초콜릿 공장〉 속 '초콜릿 공장'의 이미지를 모티브로 기획된 엔딩크레딧 타이포그래픽 포스터다. 기묘하고 환상적인 세계관, 규칙을 벗어난 상상력, 그리고 예측 불가능한 시각적 장치들이 공장 곳곳에 숨어 있는 것처럼, 각 작업은 공장의 한 파트처럼 서로 연결되어 있으면서도 독립적인 개성과 실험성을 가진다. 타이포그래피 자체를 공장의 부품처럼 다루며, InDesign을 사용해 정교한 편집 레이아웃 안에서 자유로운 실험을 시도하였다."
      meta={[
        { label: "ROLE",   value: "Concept · Typography · Editorial Design" },
        { label: "TOOLS",  value: "Adobe InDesign" },
        { label: "CLIENT", value: "Personal Work" },
        { label: "YEAR",   value: "2025" },
      ]}
      additionalImages={[
        { src: "/images/works/chocolate_01.png", alt: "EnC 타이포그래픽 포스터 — 상세 1" },
        { src: "/images/works/chocolate_02.png", alt: "EnC 타이포그래픽 포스터 — 상세 2" },
      ]}
    />
  );
}
