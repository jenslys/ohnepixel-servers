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

  // useEffect hook to fetch server info when a map is selected
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL; // API URL from environment variables
    if (selectedMap) { // If a map is selected
      let leastPlayers = Infinity; // Initialize leastPlayers with Infinity
      let leastPlayersServer = ''; // Initialize leastPlayersServer with empty string

      // Map over the IPs of the selected map and fetch server info for each IP
      const fetchPromises = selectedMap.ips.map(ip => {
        return fetch(`${apiUrl}/api/server-info?ip=${ip}`) // Fetch server info
          .then(response => response.json()) // Parse response as JSON
          .then(data => {
            if (data.response && data.response.servers) { // If response contains server info
              const server = data.response.servers[0]; // Get the first server from the response
              // If the server has less players than max_players and less than leastPlayers
              if (server.players < server.max_players && server.players < leastPlayers) {
                leastPlayers = server.players; // Update leastPlayers
                leastPlayersServer = ip; // Update leastPlayersServer
                setSelectedServerName(server.name); // Set selected server name
                setSelectedServer(leastPlayersServer); // Set selected server
              }
            }
          })
          .catch(error => { // Catch and log any errors
            console.error('Error fetching server info for IP:', ip, 'Error:', error);
          });
      });

      // Once all fetches are completed, set isLoading and isButtonDisabled to false
      Promise.all(fetchPromises).then(() => {
        setIsLoading(false);
        setIsButtonDisabled(false);
      });
    }
  }, [selectedMap]); // Run useEffect hook whenever selectedMap changes

  const connectToServer = () => {
    console.log('Connecting to server:', selectedServer);
    window.location.href = `steam://connect/${selectedServer}`;
  };

  return (
    <div className="container">
      <h1>OhnePixel Server List [Beta]</h1>
      <p>Fetches the server with the least amount of players.</p>
      <a href='https://github.com/jenslys/ohnepixel-servers' style={{textDecoration: 'none', color: 'gray', marginTop:'-18px'}}><small>[Source Code]</small></a>
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
