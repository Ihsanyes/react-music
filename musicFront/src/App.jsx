import React, { useState, useEffect, useRef } from "react";
import { clientId } from "../apiId";

const CLIENT_ID = clientId; // Replace with your Jamendo API client_id

export default function JamendoMusicApp() {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [playingTrack, setPlayingTrack] = useState(null);
  const audioRef = useRef(null);

  // Fetch popular songs initially or search results
  const fetchSongs = async (query = "") => {
    const url = query
      ? `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=20&search=${encodeURIComponent(query)}`
      : `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=20&order=popularity_total`;
    const res = await fetch(url);
    const data = await res.json();
    setSongs(data.results);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const playSong = (song) => {
    setPlayingTrack(song);
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Music Player</h1>
      <input
        type="text"
        placeholder="Search songs or artists..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchSongs(searchTerm)}
        style={{ width: "100%", padding: 10, fontSize: 16, marginBottom: 20 }}
      />

      <div>
        {songs.length === 0 && <p>No songs found.</p>}
        {songs.map((song) => (
          <div
            key={song.id}
            onClick={() => playSong(song)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: 10,
              marginBottom: 10,
              cursor: "pointer",
              backgroundColor: playingTrack?.id === song.id ? "#06b62caa" : "#a47171aa",
              borderRadius: 6,
            }}
          >
            <img
              src={song.album_image}
              alt={song.name}
              style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4, marginRight: 10 }}
            />
            <div>
              <div style={{ fontWeight: "bold" }}>{song.name}</div>
              <div style={{ fontSize: 14, color: "#555" }}>{song.artist_name}</div>
            </div>
          </div>
        ))}
      </div>

      {playingTrack && (
        <div style={{ marginTop: 30 }}>
          <h3>Now Playing:</h3>
          <div>{playingTrack.name} — {playingTrack.artist_name}</div>
          <audio controls ref={audioRef} style={{ width: "100%" }}>
            <source src={playingTrack.audio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}
