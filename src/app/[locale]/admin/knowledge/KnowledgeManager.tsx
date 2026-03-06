"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface KnowledgeDoc {
  id: string;
  title: string;
  content: string;
  category: string;
  is_active: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = ["general", "service", "faq", "pricing"];

export function KnowledgeManager() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  // 폼 상태
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");

  // 임베딩 상태
  const [embedding, setEmbedding] = useState(false);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    const url = filter
      ? `/api/admin/knowledge?category=${filter}`
      : "/api/admin/knowledge";
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setDocuments(data.documents || []);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const method = editingId ? "PUT" : "POST";
    const body = editingId
      ? { id: editingId, title, content, category }
      : { title, content, category };

    const res = await fetch("/api/admin/knowledge", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      toast.success(editingId ? "문서가 수정되었습니다" : "문서가 추가되었습니다");
      resetForm();
      fetchDocs();
    } else {
      toast.error("오류가 발생했습니다");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const res = await fetch(`/api/admin/knowledge?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("삭제되었습니다");
      fetchDocs();
    }
  };

  const handleEmbed = async (docId?: string) => {
    setEmbedding(true);
    const body = docId ? { documentId: docId } : { all: true };

    const res = await fetch("/api/admin/knowledge/embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      toast.success(`${data.embedded}개 문서 임베딩 완료`);
      fetchDocs();
    } else {
      const err = await res.json();
      toast.error(err.error || "임베딩 실패");
    }
    setEmbedding(false);
  };

  const startEdit = (doc: KnowledgeDoc) => {
    setEditingId(doc.id);
    setTitle(doc.title);
    setContent(doc.content);
    setCategory(doc.category);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setTitle("");
    setContent("");
    setCategory("general");
  };

  const hasEmbedding = (doc: KnowledgeDoc) =>
    doc.metadata && "embedded_at" in doc.metadata;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Knowledge Base
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            RAG 챗봇이 참고할 지식 베이스를 관리하세요
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEmbed()}
            disabled={embedding}
            className="px-4 py-2 text-sm bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 disabled:opacity-50"
          >
            {embedding ? "임베딩 중..." : "전체 임베딩 생성"}
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-4 py-2 text-sm bg-amber-500 text-black rounded-lg hover:bg-amber-400 font-medium"
          >
            + 문서 추가
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("")}
          className={`px-3 py-1 text-xs rounded-full ${
            !filter
              ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
          }`}
        >
          전체
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 text-xs rounded-full capitalize ${
              filter === cat
                ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-3"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문서 제목"
              required
              className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="문서 내용 (FAQ 답변, 서비스 설명, 가격 정보 등)"
            required
            rows={6}
            className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm resize-y"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm bg-zinc-200 dark:bg-zinc-700 rounded-lg"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-amber-500 text-black rounded-lg font-medium"
            >
              {editingId ? "수정" : "추가"}
            </button>
          </div>
        </form>
      )}

      {/* Document List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <p>아직 등록된 문서가 없습니다</p>
          <p className="text-sm mt-1">
            서비스 소개, FAQ, 가격 정보 등을 추가해보세요
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                      {doc.title}
                    </h3>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 capitalize">
                      {doc.category}
                    </span>
                    {hasEmbedding(doc) ? (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        Embedded
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                        Not embedded
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                    {doc.content}
                  </p>
                </div>
                <div className="flex gap-1 ml-4">
                  {!hasEmbedding(doc) && (
                    <button
                      onClick={() => handleEmbed(doc.id)}
                      disabled={embedding}
                      className="p-1.5 text-zinc-400 hover:text-amber-500"
                      title="임베딩 생성"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(doc)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    title="수정"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-500"
                    title="삭제"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
