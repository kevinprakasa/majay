import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export default function DeleteSaleModal({
  open,
  deletedId,
  onDeleted,
  onClose,
}: {
  open: boolean;
  deletedId: string;
  onDeleted: () => void;
  onClose: () => void;
}) {
  const deleteModalRef = useRef<HTMLDialogElement>(null);
  // mutate for delete sku
  const {
    mutate: deleteSale,
    isPending: isDeleting,
    error: errorDeleting,
  } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/sales/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
        }),
      });
      if (!res.ok) {
        throw new Error(
          `HTTP error! Status: ${res.status} ${await res.text()} `
        );
      }
      return res.json();
    },
    onSuccess: () => {
      onDeleted();
    },
  });

  useEffect(() => {
    if (open) {
      deleteModalRef.current?.showModal();
    } else {
      deleteModalRef.current?.close();
    }
  }, [open]);

  return (
    <dialog ref={deleteModalRef} onClose={onClose} className='modal'>
      <div className='modal-box'>
        <h3 className='text-lg font-bold'>Menghapus data sales ini</h3>
        <p className='py-4'>
          Apakah Anda yakin ingin menghapus sales ini? Tindakan ini tidak dapat
          dibatalkan.
        </p>
        <div className='modal-action'>
          <form method='dialog' className='w-full'>
            {/* if there is a button in form, it will close the modal */}
            <div className='flex justify-between'>
              <button className='btn btn-neutral' onClick={onClose}>
                Batalkan
              </button>
              <button
                className='btn btn-error '
                onClick={() => deleteSale(deletedId)}
              >
                {isDeleting && (
                  <span className='loading loading-spinner'></span>
                )}
                Hapus
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
