import { CaseStudy } from "@/app/components/case-study/CaseStudy";

export const metadata = {
  title: "Orbital Synthesis Lab — LATENCY",
  description: "시각 요소의 합성 실험 — 색과 형태, 위치가 격자 위에서 결합하고 분리되는 시각 언어 탐구.",
};

export default function OrbitalSynthesisLabPage() {
  return (
    <CaseStudy
      categoryLabel="Graphic Design"
      year="2025"
      title="Orbital Synthesis Lab"
      image={{ src: "/images/works/orbital-synthesis-lab.png", alt: "Orbital Synthesis Lab — 격자 위에 배치된 색과 형태의 합성 실험", width: 1200, height: 1600 }}
      description="Orbital Synthesis Lab은 디자인이라는 행위를 화학적 합성에 빗댄 시각 실험이다. 색과 형태, 위치라는 기본 요소들이 마치 분자처럼 서로의 궤도를 그리며 결합하고 분리될 때, 어떤 결과가 만들어지는지를 격자 위에 펼쳐 보였다. 정해진 정답이 아닌, 요소들 사이의 가능한 관계들을 한 화면에 모아 놓음으로써 시각 언어가 구성되는 과정 자체를 작업의 결과물로 삼았다."
      meta={[
        { label: "ROLE",   value: "Concept · Visual Design · Systematic Composition" },
        { label: "CLIENT", value: "Personal Work" },
        { label: "YEAR",   value: "2025" },
      ]}
    />
  );
}
