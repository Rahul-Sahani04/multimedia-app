import React, { useState, useEffect } from 'react';
import { data } from './data';
import { Header } from './components/Header';
import { AudioPlayer } from './components/AudioPlayer';
import { DocumentViewer } from './components/DocumentViewer';
import { VideoPlayer } from './components/VideoPlayer';
import { ImageViewer } from './components/ImageViewer';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function App() {
  const [myFiles, setMyFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePath, setFilePath] = useState("/file-server/");
  const [showChartModal, setShowChartModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);

  useEffect(() => {
    setMyFiles([...data, ...deletedFiles]);
  }, []);

  useEffect(() => {
    const types = Array.from(new Set(data.map((file) => file.type)));
    setFileTypes(types)
    if (searchTerm === "") {
      setFilteredFiles(myFiles);
    } else {
      const filtered = myFiles.filter((file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  }, [searchTerm, myFiles]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleRename = () => {
    if (selectedFile) {
      const newFiles = myFiles.map((file) => {
        if (file.id === selectedFile.id) {
          return {
            ...file,
            name: prompt("Enter new name"),
          };
        }
        return file;
      });
      setMyFiles(newFiles);
      setSelectedFile(null);
    }
  };

  const handleDelete = () => {
    if (selectedFile) {
      const newFiles = myFiles.filter((file) => file.id !== selectedFile.id);
      setMyFiles(newFiles);
      setDeletedFiles([...deletedFiles, selectedFile]);
      setSelectedFile(null);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterByType = (type) => {
    if (type === "all") {
      setFilteredFiles(myFiles);
    } else {
      const filtered = myFiles.filter((file) => file.type === type);
      setFilteredFiles(filtered);
    }
  };

  var barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Files Breakdown',
      },
    },
  };

  return (
    <>
      {showChartModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <p style={{ fontWeight: "bold" }}>Files Breakdown</p>
              <button style={styles.closeButton} onClick={() => setShowChartModal(false)}>close</button>
            </div>
            <div style={styles.modalBody}>
              <Pie
                data={{
                  labels: ['Video', 'Audio', 'Document', 'Image'],
                  datasets: [
                    {
                      label: 'Files Breakdown',
                      data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
              <Bar
                data={{
                  labels: ['Video', 'Audio', 'Document', 'Image'],
                  datasets: [
                    {
                      label: 'Files Breakdown',
                      data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={barChartOptions}
              />
            </div>
          </div>
        </div>
      )}
      <div className="App">
        <Header />
        <div style={styles.container}>
          <div style={{ padding: 10, paddingBottom: 0 }}>
            <p style={{ fontWeight: "bold" }}>My Files</p>
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* File organization sidebar */}
          <div style={styles.fileContainer}>
            <div style={styles.sidebar}>
              <p style={{ fontWeight: "bold" }}>Filter By Type</p>
              <ul style={styles.container}>
                <li onClick={() => filterByType("all")} style={styles.filterButton}>All Files</li>
                {fileTypes.map((type) => (
                  <li key={type} onClick={() => filterByType(type)} style={styles.filterButton}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </li>
                ))}
              </ul>
            </div>
            {/* File list */}
            <div style={styles.fileList}>
              {filteredFiles.map((file) => (
                <div
                  style={{
                    ...styles.file,
                    backgroundColor:
                      selectedFile && selectedFile.id === file.id
                        ? "#ccc"
                        : "#eee",
                  }}
                  key={file.id}
                  onClick={() => handleFileSelect(file)}
                >
                  <p>{file.name}</p>
                </div>
              ))}
            </div>
            {/* File details */}
            {selectedFile && (
              <div style={styles.fileViewer}>
                {selectedFile.type === "video" && (
                  <VideoPlayer path={selectedFile.path} />
                )}
                {selectedFile.type === "audio" && (
                  <AudioPlayer path={selectedFile.path} />
                )}
                {selectedFile.type === "document" && (
                  <DocumentViewer path={selectedFile.path} />
                )}
                {selectedFile.type === "image" && (
                  <ImageViewer path={selectedFile.path} />
                )}
                <p style={{ fontWeight: "bold", marginTop: 10 }}>
                  {selectedFile.name}
                </p>
                <p>
                  path: <span style={{ fontStyle: "italic" }}>{selectedFile.path}</span>
                </p>
                <p>
                  file type: <span style={{ fontStyle: "italic" }}>{selectedFile.type}</span>
                </p>
                <div style={styles.controlTools}>
                  <button onClick={handleRename} style={styles.controlButton}>Rename</button>
                  <button onClick={handleDelete} style={styles.controlButton}>Delete</button>
                  <button style={styles.controlButton}
                  onClick={() => {
                    if (selectedFile) {
                      window.open(selectedFile.path, "_blank")
                    }
                  }}
                >Download</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    backgroundColor: "#fff",
    color: "#000",
  },
  fileContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
  },
  sidebar: {
    width: "20%",
    padding: "10px",
  },
  fileList: {
    width: "40%",
    padding: "10px",
  },
  file: {
    backgroundColor: "#eee",
    padding: "10px",
    marginBottom: "10px",
    cursor: "pointer",
  },
  fileViewer: {
    padding: "10px",
    margin: "10px",
    width: "30vw",
    height: "100vh",
    cursor: "pointer",
    borderLeft: "1px solid #000",
  },
  button: {
    padding: "10px",
    margin: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  controlTools: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '10px',
  },
  controlButton: {
    padding: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },

  filterButton: {
    backgroundColor: "#eee",
    padding: "5px",
    listStyleType: "none",
    margin: "5px",
    border: "none",
    cursor: "pointer",
    width: "40%",
  },

};
