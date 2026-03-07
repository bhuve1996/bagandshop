'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, type PageRecord, type SectionRecord, type SectionTypeDef } from '@/lib/api';
import { SchemaForm } from '@/components/SchemaForm';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function SectionCard({
  section,
  typeDef,
  index,
  onEdit,
  onDelete,
  moveCard,
  onDropEnd,
}: {
  section: SectionRecord;
  typeDef?: SectionTypeDef | null;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  moveCard: (from: number, to: number) => void;
  onDropEnd: () => void;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: 'SECTION',
    item: { id: section.id, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    end: () => onDropEnd(),
  });
  const [, drop] = useDrop({
    accept: 'SECTION',
    hover: (item: { id: string; index: number }) => {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    },
  });

  const ref = (node: HTMLDivElement | null): void => {
    drag(drop(node));
  };

  return (
    <div
      ref={ref}
      className={`bg-white border rounded-lg p-4 flex items-center justify-between cursor-move hover:border-blue-400 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-gray-400">⋮⋮</span>
        <span className="font-medium">{typeDef?.name ?? section.section_type}</span>
        <span className="text-sm text-gray-500">({section.section_type})</span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="text-sm text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-sm text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [page, setPage] = useState<PageRecord | null>(null);
  const [sections, setSections] = useState<SectionRecord[]>([]);
  const [sectionTypes, setSectionTypes] = useState<SectionTypeDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionRecord | null>(null);
  const [editingSettings, setEditingSettings] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const pageData = await api.pages.get(id);
      setPage(pageData);
      setSections(pageData.sections ?? []);
      const types = await api.sections.types(pageData.template_type);
      setSectionTypes(types);
    } catch {
      setPage(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) load();
  }, [id]);


  const moveCard = useCallback((fromIndex: number, toIndex: number) => {
    setSections((prev) => {
      const reordered = [...prev];
      const [removed] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, removed);
      return reordered;
    });
  }, []);

  const persistOrder = useCallback(async () => {
    if (sections.length === 0) return;
    await api.sections.reorder(id, sections.map((s) => s.id));
  }, [id, sections]);

  const addSection = async (typeId: string) => {
    setSaving(true);
    try {
      const typeDef = sectionTypes.find((t) => t.type_id === typeId);
      const newSection = await api.sections.create({
        page_id: id,
        section_type: typeId,
        settings: typeDef?.default_settings ?? {},
        sort_order: sections.length,
      });
      setSections((prev) => [...prev, newSection]);
      setAddModal(false);
    } finally {
      setSaving(false);
    }
  };

  const openSectionEdit = (section: SectionRecord) => {
    setEditingSection(section);
    setEditingSettings(section.settings);
  };

  const updateSectionSettings = async () => {
    if (!editingSection) return;
    setSaving(true);
    try {
      const updated = await api.sections.update(editingSection.id, { settings: editingSettings });
      setSections((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s)),
      );
      setEditingSection(updated);
      setEditingSettings(updated.settings);
    } finally {
      setSaving(false);
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (!confirm('Delete this section?')) return;
    await api.sections.delete(sectionId);
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    if (editingSection?.id === sectionId) setEditingSection(null);
  };

  if (loading || !page) {
    return (
      <div className="p-8">
        {!page && !loading ? (
          <p>Page not found. <Link href="/pages" className="text-blue-600">Back to pages</Link></p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-8 max-w-4xl flex gap-8">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">{page.title}</h1>
              <p className="text-gray-500">/{page.slug} · {page.template_type}</p>
            </div>
            <div className="flex gap-2">
              <a
                href={`${process.env.NEXT_PUBLIC_STOREFRONT_URL ?? 'http://localhost:3000'}${page.slug === '/' ? '/' : page.slug}?preview=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Preview
              </a>
              <Link href="/pages" className="px-4 py-2 border rounded hover:bg-gray-50">
                Back
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {sections.map((section, index) => {
              const typeDef = sectionTypes.find((t) => t.type_id === section.section_type);
              return (
                <SectionCard
                  key={section.id}
                  section={section}
                  typeDef={typeDef}
                  index={index}
                  onEdit={() => openSectionEdit(section)}
                  onDelete={() => deleteSection(section.id)}
                  moveCard={moveCard}
                  onDropEnd={persistOrder}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setAddModal(true)}
            className="mt-4 w-full border-2 border-dashed border-gray-300 rounded-lg py-6 text-gray-500 hover:border-blue-400 hover:text-blue-600"
          >
            + Add section
          </button>
        </div>

        {editingSection && (
          <div className="w-80 shrink-0 bg-white rounded-lg shadow p-6 sticky top-8">
            <h3 className="font-bold mb-4">Section settings</h3>
            <SchemaForm
              schema={
                sectionTypes.find((t) => t.type_id === editingSection.section_type)
                  ?.schema ?? { properties: {} }
              }
              formData={editingSettings}
              onChange={setEditingSettings}
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={updateSectionSettings}
                disabled={saving}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="text-sm text-gray-500 hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {addModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Add section</h2>
            <div className="grid grid-cols-2 gap-2">
              {sectionTypes.map((t) => (
                <button
                  key={t.type_id}
                  type="button"
                  disabled={saving}
                  onClick={() => addSection(t.type_id)}
                  className="p-4 border rounded hover:bg-gray-50 text-left"
                >
                  <span className="font-medium">{t.name}</span>
                  <span className="block text-sm text-gray-500">{t.category}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setAddModal(false)}
              className="mt-4 w-full py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </DndProvider>
  );
}
