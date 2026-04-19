export default function DealRoomEmptyState() {
  return (
    <div className="deal-room-page-wrap">
      <div className="deal-room deal-room--empty">
        <h1 className="deal-room-title">Deal Room</h1>
        <p className="deal-room-lead">Manage your sponsorship conversations.</p>
        <p className="deal-room-empty-msg">
          No conversations yet. When you connect with organizers, threads will appear here.
        </p>
      </div>
    </div>
  );
}
