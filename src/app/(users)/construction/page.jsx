'use client';

export default function Page() {
  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      // Background Settings
      backgroundImage: 'url("/assets/login.png")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      margin: 0,
      padding: 0,
      overflow: "hidden"
    }}>
      {/* The actual text content */}
      <div className="maintenance-container">
        <h1 className="maintenance-text">SITE UNDER MAINTENANCE</h1>
        <p className="sub-text">We're fine-tuning things for a better experience. Stay tuned!</p>
      </div>

      <style jsx>{`
        .maintenance-container {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          padding: 40px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
          margin: 20px;
        }

        .maintenance-text {
          font-size: 48px;
          color: white;
          font-weight: 900;
          letter-spacing: 2px;
          margin: 0;
          text-shadow: 2px 2px 10px rgba(0,0,0,0.8);
        }

        .sub-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 18px;
          margin-top: 10px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .maintenance-text {
            font-size: 32px;
          }
          .sub-text {
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .maintenance-text {
            font-size: 24px;
          }
          .maintenance-container {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}