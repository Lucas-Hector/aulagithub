// =========================================================
// 1. Inicialização do Mapa (Leaflet)
// =========================================================

// Configura o mapa com a visualização inicial focada no Brasil (exemplo: Porto Velho)
const map = L.map('air-map').setView([-8.76, -63.90], 5); 

// Adiciona uma camada de mapa (Tiles) do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// =========================================================
// 2. Criação do Ícone da Aeronave
// =========================================================

// Cria um ícone personalizado para a aeronave (usando um emoji ou imagem)
const airplaneIcon = L.divIcon({
    className: 'airplane-icon',
    html: '✈️', // O emoji que será a aeronave
    iconSize: [24, 24],
    iconAnchor: [12, 12] // Centraliza o ícone
});

// =========================================================
// 3. Simulação de Aeronaves
// Em um projeto real, esses dados viriam de uma API em tempo real.
// =========================================================

let aircrafts = [
    { 
        id: 'TAM456', 
        callsign: 'TAM456', 
        lat: -10.0, 
        lon: -60.0, 
        altitude: 35000, 
        speed: 850, 
        heading: 10, // Direção: 0 (Norte) a 360
        marker: null // Referência para o marcador no mapa
    },
    { 
        id: 'GLO101', 
        callsign: 'GLO101', 
        lat: -15.0, 
        lon: -55.0, 
        altitude: 38000, 
        speed: 780, 
        heading: 300, 
        marker: null
    },
    { 
        id: 'AZU789', 
        callsign: 'AZU789', 
        lat: -5.0, 
        lon: -65.0, 
        altitude: 30000, 
        speed: 750, 
        heading: 180, 
        marker: null
    }
];

// =========================================================
// 4. Funções de Rastreamento
// =========================================================

// Função para atualizar a posição de uma aeronave simulada
function simulateMovement(aircraft) {
    // Cálculo de movimento muito simples (apenas para fins de demonstração)
    const distance = aircraft.speed / 3600 / 60; // Distância por segundo (em graus aproximados)
    const angleInRadians = aircraft.heading * (Math.PI / 180);

    // Nova Latitude e Longitude
    aircraft.lat += distance * Math.cos(angleInRadians);
    aircraft.lon += distance * Math.sin(angleInRadians);
}

// Função para renderizar e atualizar os marcadores no mapa
function updateAircraftMarkers() {
    aircrafts.forEach(aircraft => {
        // Simula o movimento antes de atualizar o mapa
        simulateMovement(aircraft);
        
        const newLatLng = L.latLng(aircraft.lat, aircraft.lon);
        
        // Conteúdo do Popup (informações da aeronave)
        const popupContent = `
            <strong>Voo: ${aircraft.callsign}</strong><br>
            Altitude: ${aircraft.altitude.toLocaleString()} pés<br>
            Velocidade: ${aircraft.speed} km/h<br>
            Rota: ${aircraft.heading}°
        `;

        if (!aircraft.marker) {
            // Se o marcador não existe, cria um novo
            aircraft.marker = L.marker(newLatLng, {
                icon: airplaneIcon,
                rotationAngle: aircraft.heading // Gira o ícone de acordo com a rota (Leaflet não suporta isso nativamente, mas alguns plugins sim)
            }).addTo(map)
              .bindPopup(popupContent);
              
        } else {
            // Se o marcador já existe, apenas move ele
            aircraft.marker.setLatLng(newLatLng);
            
            // Atualiza o conteúdo do popup e a rota
            aircraft.marker.getPopup().setContent(popupContent);
            
            // Nota: Para rotação de ícones no Leaflet, você precisaria de um plugin como 'leaflet-rotatedmarker'
            // aircraft.marker.setRotationAngle(aircraft.heading); 
        }
    });
}

// =========================================================
// 5. Loop de Atualização
// =========================================================

// Chama a função de atualização a cada 3 segundos
setInterval(updateAircraftMarkers, 3000); 

// Chama uma vez para popular o mapa inicialmente
updateAircraftMarkers();