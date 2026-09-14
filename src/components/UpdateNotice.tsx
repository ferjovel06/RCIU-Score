interface UpdateNoticeProps {
  visible: boolean;
  onUpdate: () => void;
}

export function UpdateNotice({ visible, onUpdate }: UpdateNoticeProps) {
  if (!visible) return null;

  return <div className="update-notice">
    <p>Hay una nueva versión. Al actualizar se reinician las selecciones.</p>
    <button onClick={onUpdate}>Actualizar ahora</button>
  </div>;
}
