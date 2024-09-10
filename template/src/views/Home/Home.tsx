import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-base-content flex flex-col">
      <nav className="flex justify-between items-center p-6 bg-base-300 shadow-md">
        <div className="text-2xl font-bold">
          <span className="text-primary">Veil</span>
        </div>
        <div>
          <button
            className="bg-transparent text-base-content mr-6 hover:text-primary transition-colors"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button
            className="bg-transparent text-base-content mr-6 hover:text-primary transition-colors"
            onClick={() => navigate('/register')}
          >
            Sign Up
          </button>
        </div>
      </nav>

      <header className="flex flex-col items-center justify-center text-center mt-20 px-4 flex-1">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
          Connect in real-time <br /> with your community
        </h1>
        <p className="mt-6 max-w-2xl text-base-content">
          Experience seamless, user-friendly messaging that brings people
          together effortlessly.
        </p>
        <button
          className="mt-8 bg-primary hover:bg-base-content text-primary-content px-6 py-3 rounded-full text-lg transition-colors"
          onClick={() => navigate('/login')}
        >
          Start Chatting Now
        </button>
      </header>

      <section className="mt-20 px-8 text-center flex-1">
        <h2 className="text-3xl font-semibold mb-16 text-base-content">
          Features for a better experience
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-base-200 p-6 rounded-full">
            <span className="text-error text-3xl">📹</span>
            <h3 className="text-xl font-semibold mt-4">Video messaging</h3>
            <p className="text-base-content mt-2">
              Record and send video messages easily for direct and meaningful
              communication.
            </p>
          </div>
          <div className="bg-base-200 p-6 rounded-full">
            <span className="text-info text-3xl">🔒</span>
            <h3 className="text-xl font-semibold mt-4">Keep safe & private</h3>
            <p className="text-base-content mt-2">
              Keep conversations secure with encryption, ensuring total privacy.
            </p>
          </div>
          <div className="bg-base-200 p-6 rounded-full">
            <span className="text-success text-3xl">📁</span>
            <h3 className="text-xl font-semibold mt-4">Quick File Sharing</h3>
            <p className="text-base-content mt-2">
              Share documents, photos, and videos instantly with quick file
              sharing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
