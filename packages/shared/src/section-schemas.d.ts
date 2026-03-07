import type { SectionTypeDefinition } from './types';
import type { TemplateType } from './types';
export declare const SECTION_TYPES: SectionTypeDefinition[];
export declare function getSectionTypesForTemplate(templateType: TemplateType): SectionTypeDefinition[];
export declare function getSectionType(typeId: string): SectionTypeDefinition | undefined;
