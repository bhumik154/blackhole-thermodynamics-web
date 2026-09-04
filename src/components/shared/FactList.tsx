import { Fact } from "@/data/facts";

interface FactListProps {
  facts: Fact[];
  limit?: number;
}

export function FactList({ facts, limit = 5 }: FactListProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {facts.slice(0, limit).map((fact, i) => (
        <div key={i} className="flex gap-2.5 items-start">
          <span className="text-base leading-none mt-0.5 flex-shrink-0">{fact.icon}</span>
          <span className="text-caption text-muted leading-relaxed">{fact.text}</span>
        </div>
      ))}
    </div>
  );
}
