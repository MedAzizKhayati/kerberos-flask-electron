import React, { useEffect, useState } from 'react';
import AppBar from './AppBar';
import { axiosInstance } from './services/api.config';
import Toggle from './components/Toggle';

function App() {
  const [isAuthActive, setIsAuthActive] = useState<boolean>(false);
  const [publicData, setPublicData] = useState<string | null>(null);
  const [protectedData, setProtectedData] = useState<string | null>(null);
  const [protectedError, setProtectedError] = useState<string | null>(null);
  const [protectedLoading, setProtectedLoading] = useState<boolean>(false);
  const [publicLoading, setPublicLoading] = useState<boolean>(false);

  const getPublicData = () => {
    setPublicLoading(true);
    axiosInstance.get('/public').then(({ data }) => {
      console.log(data);
      setPublicData(data.data);
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setPublicLoading(false);
    })
  }
  const getProtectedData = () => {
    if (window.Main) {
      setProtectedLoading(true);
      axiosInstance.get('/protected', {
        headers: {
          Mode: isAuthActive ? "auth" : "no-auth"
        }
      })
      .then(({data}) => {
        setProtectedData(data.data);
        setProtectedError(null);
      })
      .catch((err) => {
        console.log(err);
        setProtectedError(err.response.data);
      }).finally(() => {
        setProtectedLoading(false);
      });
    } else {
      setProtectedError('This feature is only available in the Electron App');
    }
  };


  return (
    <div className="flex flex-col h-screen">
      {window.Main && (
        <div className="flex-none">
          <AppBar />
        </div>
      )}
      <div className="flex-auto text-white">
        <div className="relative p-5 flex flex-col justify-center items-center h-full bg-gray-800 space-y-4">
          <h1 className="text-xl text-gray-200">
            This is a demo showcase for Kerberos Authentication to a Rest API
          </h1>
          
          <div className="grid grid-cols-2 gap-4 w-full"> 
            <div className="col-start-1 flex flex-col items-center gap-4">
              <button
                disabled={publicLoading}
                className="text-black bg-yellow-400 py-2 px-4 rounded focus:outline-none shadow hover:bg-yellow-200"
                onClick={getPublicData}
              >
                Public
              </button>
              {
                  publicLoading ? (
                    <div className="w-10 h-10 border-4 border-t-0 border-r-0 border-gray-200 rounded-full animate-spin" />
                  ) : (
                    publicData && (
                      <p className='text-center'>
                        {publicData}
                      </p>
                    )
                )
              }
            </div>

            <div className="col-start-2 flex flex-col items-center gap-4">
              <button
                disabled={protectedLoading}
                className="text-black bg-yellow-400 py-2 px-4 rounded focus:outline-none shadow hover:bg-yellow-200"
                onClick={getProtectedData}
              >
                Protected
              </button>
              {
                protectedLoading ? (
                  <div className="w-10 h-10 border-4 border-t-0 border-r-0 border-gray-200 rounded-full animate-spin" />
                ): ( protectedError ? (
                    <p className='text-center text-red-500'>
                      {protectedError}
                    </p>
                  ) : (
                    protectedData && (
                      <p className='text-center'>
                        {protectedData}
                      </p>
                    )
                  )
                )
              }
            </div>
            
          </div>
          <div className='absolute top-4 right-10'>
            <Toggle 
              checked={isAuthActive}
              onChange={setIsAuthActive}
              label="Authentication Via Kerberos"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
