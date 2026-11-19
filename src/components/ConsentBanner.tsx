interface Props {
  onAccept: () => void;
  onDecline: () => void;
}

export function ConsentBanner({ onAccept, onDecline }: Props) {
  return (
    <section className="consent" aria-label="Analytics consent">
      <p>
        May Klaveo count visits with Google Analytics? It records page views and which language and
        theme you pick – never the text you type.
      </p>
      <div className="actions">
        <button className="btn ghost" onClick={onDecline}>
          Decline
        </button>
        <button className="btn" onClick={onAccept}>
          Accept
        </button>
      </div>
    </section>
  );
}
