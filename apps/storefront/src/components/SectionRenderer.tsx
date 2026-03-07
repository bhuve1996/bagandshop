import { getSectionComponent } from '@/components/sections';

interface SectionData {
  id: string;
  section_type: string;
  settings: Record<string, unknown>;
  visibility?: Record<string, unknown> | null;
}

interface SectionRendererProps {
  sections: SectionData[];
  context?: Record<string, unknown>;
}

export function SectionRenderer({ sections, context }: SectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        const Component = getSectionComponent(section.section_type);
        if (!Component) {
          return (
            <div key={section.id} className="py-4 text-center text-gray-400 text-sm">
              Unknown section: {section.section_type}
            </div>
          );
        }
        return (
          <Component
            key={section.id}
            settings={section.settings}
            context={context}
          />
        );
      })}
    </>
  );
}
