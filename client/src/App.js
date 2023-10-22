import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const maps = [
    { name: 'Italy', image: 'maps/italy.jpg', ips: ['164.132.200.9:27015', '164.132.200.9:27016', '164.132.200.9:27017', '164.132.200.9:27018', '164.132.200.9:27019'] },
    { name: 'Dust 2', image: 'maps/dust2.jpg', ips: ['164.132.200.5:27015', '164.132.200.5:27016', '164.132.200.5:27017', '164.132.200.5:27018', '164.132.200.5:27019'] },
    { name: 'Anubis', image: 'maps/anubis.jpg', ips: ['164.132.200.7:27015', '164.132.200.7:27016', '164.132.200.7:27017', '164.132.200.7:27018', '164.132.200.7:27019'] },
    { name: 'Vertigo', image: 'maps/vertigo.jpg', ips: ['149.202.64.64:27015', '149.202.64.64:27016', '149.202.64.64:27017', '149.202.64.64:27018', '149.202.64.64:27019'] },
    { name: 'Nuke', image: 'maps/nuke.jpg', ips: ['149.202.64.12:27015', '149.202.64.12:27016', '149.202.64.12:27017', '149.202.64.12:27018', '149.202.64.12:27019'] },
    { name: 'Office', image: 'maps/office.jpg', ips: ['164.132.200.43:27015', '164.132.200.43:27016', '164.132.200.43:27017', '164.132.200.43:27018', '164.132.200.43:27019'] },
    { name: 'Inferno', image: 'maps/inferno.jpg', ips: ['149.202.64.190:27015', '149.202.64.190:27016', '149.202.64.190:27017', '149.202.64.190:27018', '149.202.64.190:27019'] },
  ];

  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedServer, setSelectedServer] = useState('');
  const [selectedServerName, setSelectedServerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (selectedMap) {
      let leastPlayers = Infinity;
      let leastPlayersServer = '';

      const fetchPromises = selectedMap.ips.map(ip => {
        console.log('Fetching server info for IP:', ip);
        return fetch(`${apiUrl}/api/server-info?ip=${ip}`)
          .then(response => response.json())
          .then(data => {
            //console.log('Received server info for IP:', ip, 'Data:', data);
            console.log('calling: ', `${apiUrl}/api/server-info?ip=${ip}`)
            if (data.response && data.response.servers) {
              const server = data.response.servers[0];
              if (server.players < server.max_players && server.players < leastPlayers) {
                leastPlayers = server.players;
                leastPlayersServer = ip;
                setSelectedServerName(server.name);
                setSelectedServer(leastPlayersServer);
                console.log('Selected server:', leastPlayersServer);
              }
            }
          })
          .catch(error => {
            console.error('Error fetching server info for IP:', ip, 'Error:', error);
          });
      });

      Promise.all(fetchPromises).then(() => {
        console.log('All fetches completed');
        setIsLoading(false);
        setIsButtonDisabled(false); // Enable the button after fetching completes
      });
    }
  }, [selectedMap]);

  const connectToServer = () => {
    console.log('Connecting to server:', selectedServer);
    window.location.href = `steam://connect/${selectedServer}`;
  };

  return (
    <div className="container"> {/* Add a CSS class for centering */}
      <h1>OhnePixel Server List</h1>
      <p>Fetches the server with the least amount of players.</p>
      <div className="map-buttons">
        {maps.map(map => (
          <button key={map.name} onClick={() => setSelectedMap(map)}>
            <img src={map.image} alt={map.name} />
            <p>{map.name}</p>
          </button>
        ))}
      </div>
      {selectedMap && (
        <div>
          {selectedServerName && <h2>{selectedServerName}</h2>}
          {isLoading && <h2>Loading...</h2>}
          {selectedServer && (
            <button 
              style={{backgroundColor: 'red', color:'white', fontSize: '20px', padding: '10px 20px'}}
              onClick={connectToServer} 
              disabled={isButtonDisabled}
            >
              Connect to Server
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
