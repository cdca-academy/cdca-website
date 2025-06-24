// cdca-dance-academy website

// File: pages/index.js
export default function Home() {
  return (
    <main className="p-6 text-center">
      <h1 className="text-4xl font-bold">Welcome to CDCA Academy</h1>
      <p className="mt-4 max-w-xl mx-auto">
        CDCA Academy is a 5 star dance school based in the city centre of Leicester. The academy is guaranteed to get young people moving, having fun and making friends, boosting their self-esteem and confidence, participating in shows, carnivals, competitions and events. We give all young people the opportunity to get involved no matter their ability.
      </p>
    </main>
  );
}

// File: pages/login.js
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

initializeApp(firebaseConfig);
const auth = getAuth();

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Email" className="w-full p-2 border" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-2 border" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-blue-600 text-white p-2">Login</button>
      </form>
    </div>
  );
}

// File: pages/dashboard.js
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage();

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      const listRef = ref(storage, 'videos/');
      const res = await listAll(listRef);
      const urls = await Promise.all(res.items.map(item => getDownloadURL(item)));
      setVideos(urls);
    };
    fetchVideos();
  }, []);

  if (!user) return <p className="p-6">Please log in to view this page.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.email}</h2>
      <h3 className="text-xl mb-2">Dance Videos</h3>
      <div className="space-y-4">
        {videos.map((url, index) => (
          <video key={index} controls className="w-full">
            <source src={url} type="video/mp4" />
          </video>
        ))}
      </div>
    </div>
  );
}

// File: pages/admin.js
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage();

export default function Admin() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('No file selected');
    const storageRef = ref(storage, 'videos/' + file.name);
    await uploadBytes(storageRef, file);
    alert('Video uploaded successfully!');
  };

  if (!user || user.email !== 'your@email.com') {
    return <p className="p-6">Access denied. Admins only.</p>;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Video Upload</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} className="w-full p-2 border" />
        <button type="submit" className="w-full bg-green-600 text-white p-2">Upload</button>
      </form>
    </div>
  );
}
