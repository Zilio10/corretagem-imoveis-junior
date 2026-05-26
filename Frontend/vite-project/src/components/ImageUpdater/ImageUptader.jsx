import { useState } from 'react'
import {
    DndContext,
    closestCenter,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'

import {
    SortableContext,
    useSortable,
    arrayMove,
    rectSortingStrategy,
} from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'
import { FaTrash } from 'react-icons/fa'

import { deleteImage, updateImage } from '../../services/imagemService'
import { getToken } from '../../utils/auth'

import '../../styles/components/ImageUpdater.css'

// ── Item individual ─────────────────────────────────────────────────────────
function SortableImage({ item, onOpenDeleteModal }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id_imagem })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 999 : 'auto',
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`iu-item ${isDragging ? 'iu-item--dragging' : ''}`}
        >
            <div className="iu-item__drag" {...attributes} {...listeners}>
                <img
                    src={item.endereco_imagem}
                    alt={`Imagem ${item.posicao_imagem}`}
                    className="iu-item__img"
                    draggable={false}
                />

                {item.posicao_imagem === 1 && (
                    <span className="iu-item__badge">Capa</span>
                )}
            </div>

            <button
                className="iu-item__delete"
                onClick={() => onOpenDeleteModal(item)}
                title="Remover imagem"
            >
                <FaTrash />
            </button>
        </div>
    )
}

// ── Componente principal ────────────────────────────────────────────────────
export default function ImageUpdater({ images }) {
    const [items, setItems] = useState(images ?? [])
    const [loading, setLoading] = useState(false)

    // Modal de exclusão
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    const token = getToken()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),

        useSensor(TouchSensor, {
            activationConstraint: { delay: 150, tolerance: 5 },
        })
    )

    // ── Abrir modal ─────────────────────────────────────────────────────────
    const openDeleteModal = (item) => {
        setSelectedItem(item)
        setShowDeleteModal(true)
    }

    // ── Fechar modal ────────────────────────────────────────────────────────
    const closeDeleteModal = () => {
        setSelectedItem(null)
        setShowDeleteModal(false)
    }

    // ── Drag and drop ───────────────────────────────────────────────────────
    const handleDragEnd = async ({ active, over }) => {
        if (!over || active.id === over.id) return

        const oldIndex = items.findIndex(i => i.id_imagem === active.id)
        const newIndex = items.findIndex(i => i.id_imagem === over.id)

        const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
            ...item,
            posicao_imagem: idx + 1,
        }))

        setItems(reordered)

        try {
            setLoading(true)

            const updates = reordered
                .filter((item, idx) => items[idx]?.id_imagem !== item.id_imagem)
                .map(item =>
                    updateImage(
                        item.id_imagem,
                        {
                            endereco: item.endereco_imagem,
                            posicao: item.posicao_imagem,
                            idImovel: item.id_imovel_imagem,
                        },
                        token
                    )
                )

            await Promise.all(updates)

        } catch (err) {
            console.error('Erro ao salvar posições:', err)

        } finally {
            setLoading(false)
        }
    }

    // ── Deletar imagem ──────────────────────────────────────────────────────
    const handleDelete = async (item) => {
        try {
            setLoading(true)

            await deleteImage(item.id_imagem, token)

            const updated = items
                .filter(i => i.id_imagem !== item.id_imagem)
                .map((i, idx) => ({
                    ...i,
                    posicao_imagem: idx + 1,
                }))

            setItems(updated)

            await Promise.all(
                updated.map(i =>
                    updateImage(
                        i.id_imagem,
                        {
                            endereco: i.endereco_imagem,
                            posicao: i.posicao_imagem,
                            idImovel: i.id_imovel_imagem,
                        },
                        token
                    )
                )
            )

        } catch (err) {
            console.error('Erro ao deletar imagem:', err)

        } finally {
            setLoading(false)
            closeDeleteModal()
        }
    }

    // ── Sem imagens ─────────────────────────────────────────────────────────
    if (!items.length) {
        return (
            <p className="iu-empty">
                Nenhuma imagem cadastrada.
            </p>
        )
    }

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div className="iu-wrapper">

            {loading && (
                <div className="iu-loading">
                    Salvando...
                </div>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map(i => i.id_imagem)}
                    strategy={rectSortingStrategy}
                >
                    <div className="iu-grid">
                        {items.map(item => (
                            <SortableImage
                                key={item.id_imagem}
                                item={item}
                                onOpenDeleteModal={openDeleteModal}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* ── Modal de exclusão ───────────────────────────────────── */}
            {showDeleteModal && selectedItem && (
                <div
                    className="modal-overlay"
                    onClick={closeDeleteModal}
                >
                    <div
                        className="modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p>
                            Tem certeza que deseja remover esta imagem?
                        </p>

                        <p>
                            Esta ação não poderá ser desfeita.
                        </p>

                        <div className="modal-actions">
                            <button onClick={closeDeleteModal}>
                                Cancelar
                            </button>

                            <button
                                onClick={() => handleDelete(selectedItem)}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}