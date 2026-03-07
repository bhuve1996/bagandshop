'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api, type VendorRecord, type VendorMappingRecord, type VendorInventoryRecord, type ProductRecord, type VendorRoutingRuleRecord } from '@/lib/api';

export default function EditVendor() {
  const params = useParams();
  const id = params.id as string;
  const [vendor, setVendor] = useState<VendorRecord | null>(null);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [apiType, setApiType] = useState('rest');
  const [priority, setPriority] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [mappings, setMappings] = useState<VendorMappingRecord[]>([]);
  const [inventory, setInventory] = useState<VendorInventoryRecord[]>([]);
  const [addProductId, setAddProductId] = useState('');
  const [addVendorSku, setAddVendorSku] = useState('');
  const [routingRules, setRoutingRules] = useState<VendorRoutingRuleRecord[]>([]);
  const [ruleName, setRuleName] = useState('');
  const [ruleMinOrder, setRuleMinOrder] = useState('');
  const [ruleRegion, setRuleRegion] = useState('');
  const [ruleProductTag, setRuleProductTag] = useState('');
  const [rulePriority, setRulePriority] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.products.list(undefined, undefined).then(setProducts);
  }, []);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.vendors.get(id),
      api.vendors.getMappings(id),
      api.vendors.getInventory(id),
      api.vendors.getRoutingRules(id),
    ]).then(([v, m, inv, rules]) => {
      setVendor(v);
      setName(v.name);
      setCode(v.code);
      setApiType(v.api_type);
      setPriority(v.priority);
      setIsActive(v.is_active);
      setMappings(m);
      setInventory(inv);
      setRoutingRules(rules);
    }).catch(() => setVendor(null)).finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setSaving(true);
    try {
      await api.vendors.update(id, { name, code, api_type: apiType, priority, is_active: isActive });
      const v = await api.vendors.get(id);
      setVendor(v);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !addProductId || !addVendorSku.trim()) return;
    setError('');
    try {
      await api.vendors.addMapping({ vendor_id: id, product_id: addProductId, vendor_sku: addVendorSku.trim() });
      const m = await api.vendors.getMappings(id);
      setMappings(m);
      setAddProductId('');
      setAddVendorSku('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add mapping');
    }
  };

  const handleRemoveMapping = async (mappingId: string) => {
    try {
      await api.vendors.removeMapping(mappingId);
      setMappings((prev) => prev.filter((m) => m.id !== mappingId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove');
    }
  };

  const handleSync = async () => {
    if (!id) return;
    setSyncing(true);
    setError('');
    try {
      await api.vendors.sync(id);
      const [m, inv] = await Promise.all([api.vendors.getMappings(id), api.vendors.getInventory(id)]);
      setMappings(m);
      setInventory(inv);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const handleAddRoutingRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !ruleName.trim()) return;
    setError('');
    try {
      const conditions: Record<string, unknown> = {};
      if (ruleMinOrder.trim()) conditions.min_order = parseFloat(ruleMinOrder) || 0;
      if (ruleRegion.trim()) conditions.region = ruleRegion.split(',').map((s) => s.trim()).filter(Boolean);
      if (ruleProductTag.trim()) conditions.product_tag = ruleProductTag.split(',').map((s) => s.trim()).filter(Boolean);
      await api.vendors.createRoutingRule(id, {
        name: ruleName.trim(),
        conditions: Object.keys(conditions).length ? conditions : undefined,
        priority: rulePriority,
      });
      const rules = await api.vendors.getRoutingRules(id);
      setRoutingRules(rules);
      setRuleName('');
      setRuleMinOrder('');
      setRuleRegion('');
      setRuleProductTag('');
      setRulePriority(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add rule');
    }
  };

  const handleDeleteRoutingRule = async (ruleId: string) => {
    if (!id) return;
    try {
      await api.vendors.deleteRoutingRule(id, ruleId);
      setRoutingRules((prev) => prev.filter((r) => r.id !== ruleId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete rule');
    }
  };

  if (loading || !vendor) {
    return (
      <div className="p-8">
        {!vendor && !loading ? <p>Vendor not found. <Link href="/vendors" className="text-blue-600">Back</Link></p> : <p>Loading...</p>}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Edit vendor</h1>
      <form onSubmit={handleSave} className="space-y-4 bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API type</label>
            <select className="w-full border rounded px-3 py-2" value={apiType} onChange={(e) => setApiType(e.target.value)}>
              <option value="rest">REST</option>
              <option value="webhook">Webhook</option>
              <option value="feed">Feed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={priority} onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="active" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          <label htmlFor="active">Active</label>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
          <Link href="/vendors" className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</Link>
        </div>
      </form>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Routing rules</h2>
        <p className="text-sm text-gray-500 mb-4">Rules determine which vendor is assigned to an order line (by min order, region, product tag). Higher priority wins.</p>
        <form onSubmit={handleAddRoutingRule} className="flex flex-wrap gap-3 mb-4">
          <input type="text" className="border rounded px-3 py-2 w-40" placeholder="Rule name" value={ruleName} onChange={(e) => setRuleName(e.target.value)} />
          <input type="number" className="border rounded px-3 py-2 w-24" placeholder="Min order" value={ruleMinOrder} onChange={(e) => setRuleMinOrder(e.target.value)} />
          <input type="text" className="border rounded px-3 py-2 w-32" placeholder="Region (comma)" value={ruleRegion} onChange={(e) => setRuleRegion(e.target.value)} />
          <input type="text" className="border rounded px-3 py-2 w-32" placeholder="Product tag (comma)" value={ruleProductTag} onChange={(e) => setRuleProductTag(e.target.value)} />
          <input type="number" className="border rounded px-3 py-2 w-20" placeholder="Priority" value={rulePriority} onChange={(e) => setRulePriority(parseInt(e.target.value, 10) || 0)} />
          <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">Add rule</button>
        </form>
        <ul className="divide-y">
          {routingRules.map((r) => (
            <li key={r.id} className="flex justify-between items-center py-2">
              <span className="font-medium">{r.name}</span>
              <span className="text-gray-500 text-sm">
                {r.conditions?.min_order != null && `min $${r.conditions.min_order}`}
                {r.conditions?.region && ` · ${Array.isArray(r.conditions.region) ? r.conditions.region.join(', ') : r.conditions.region}`}
                {r.conditions?.product_tag && ` · tag: ${Array.isArray(r.conditions.product_tag) ? r.conditions.product_tag.join(', ') : r.conditions.product_tag}`}
                {' · priority '}{r.priority}
              </span>
              <button type="button" onClick={() => handleDeleteRoutingRule(r.id)} className="text-red-600 text-sm hover:underline">Remove</button>
            </li>
          ))}
        </ul>
        {routingRules.length === 0 && <p className="text-gray-500 text-sm">No routing rules. Add rules to assign this vendor to orders by conditions.</p>}
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Product mapping</h2>
          <button type="button" onClick={handleSync} disabled={syncing} className="text-sm px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">
            {syncing ? 'Syncing...' : 'Sync now'}
          </button>
        </div>
        <form onSubmit={handleAddMapping} className="flex gap-2 mb-4">
          <select className="border rounded px-3 py-2 flex-1" value={addProductId} onChange={(e) => setAddProductId(e.target.value)}>
            <option value="">Select product</option>
            {products.filter((p) => !mappings.some((m) => m.product_id === p.id)).map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <input type="text" className="border rounded px-3 py-2 w-40" placeholder="Vendor SKU" value={addVendorSku} onChange={(e) => setAddVendorSku(e.target.value)} />
          <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">
            Add
          </button>
        </form>
        <ul className="divide-y">
          {mappings.map((m) => (
            <li key={m.id} className="flex justify-between items-center py-2">
              <span>{m.product?.title ?? m.product_id}</span>
              <span className="text-gray-500 text-sm">{m.vendor_sku}</span>
              <span className="text-gray-400 text-xs">{m.last_synced_at ? new Date(m.last_synced_at).toLocaleDateString() : 'Never'}</span>
              <button type="button" onClick={() => handleRemoveMapping(m.id)} className="text-red-600 text-sm hover:underline">Remove</button>
            </li>
          ))}
        </ul>
        {mappings.length === 0 && <p className="text-gray-500 text-sm">No mappings. Add a product and vendor SKU.</p>}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Vendor inventory</h2>
        <ul className="divide-y">
          {inventory.map((inv) => (
            <li key={inv.id} className="flex justify-between items-center py-2">
              <span>{inv.variant?.product?.title ?? 'Product'} – {inv.variant?.sku ?? inv.variant_id}</span>
              <span>Qty: {inv.quantity}</span>
              {inv.reserved > 0 && <span className="text-amber-600">Reserved: {inv.reserved}</span>}
            </li>
          ))}
        </ul>
        {inventory.length === 0 && <p className="text-gray-500 text-sm">No inventory recorded. Use Sync or set manually via API.</p>}
      </div>
    </div>
  );
}
