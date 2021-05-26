import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';
import { Md5 } from 'ts-md5/dist/md5';
import { Capacitor } from '@capacitor/core';
import { HTTP } from '@ionic-native/http';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

interface SimpleDocLink {
  name: string
  url: string
  mime: string
}

interface MainDocModel {
  documents?: SimpleDocLink[]
}


export interface DocumentRef {
  name: string
  url: string
  offline: boolean
}

export interface DocumentPath {
  url: string
  local: string
}

type StoreContextType = {
  documents: DocumentRef[]
  open: (rawUrl: string) => void
  download: (rawUrl: string) => void
  remove: (rawUrl: string) => void
}

const defaultStoreContext: StoreContextType = {
  documents: [],
  open: (rawUrl: string) => {
    throw new Error('open not implemented')
  },
  download: (rawUrl: string) => {
    throw new Error('download not implemented')
  },
  remove: (rawUrl: string) => {
    throw new Error('remove not implemented')
  },
}

const StoreContext = createContext<StoreContextType>(defaultStoreContext);

export const useStore = () => useContext<StoreContextType>(StoreContext)

interface StoreContextProviderProps {
  children: React.ReactChildren | React.ReactChild
}

const getPaths = async (): Promise<DocumentPath[]> => {
  const raw = localStorage.getItem('PATHS');
  if (!raw) {
    return [];
  }
  try {
    const items: DocumentPath[] = await JSON.parse(raw);
    return items;
  } catch (err) {
    console.error(err);
    localStorage.removeItem('PATHS');
    return [];
  }
}

const StoreContextProvider = (props: StoreContextProviderProps) => {
  const { data: user } = useUser();
  const mainDocRef = useFirestore()
    .collection('studylater').doc(user.uid);
  const { data: mainData } = useFirestoreDocData<MainDocModel>(mainDocRef);

  const [documentItems, setDocumentItems] = useState<DocumentRef[]>([]);
  const [availablePaths, setAvailablePaths] = useState<DocumentPath[]>([]);

  const openDocument = async (rawUrl: string) => {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      throw new Error('Operación no permitida en versión Web');
    }
    console.log(`Abriendo ${rawUrl}`);
    const docPath = availablePaths.find(p => p.url === rawUrl);
    if (!docPath) {
      throw new Error('Documento no ha sido descargado');
    }
    // Open
    await FileOpener.open(docPath.local, 'application/pdf');
  }

  const downloadDocument = async (rawUrl: string) => {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      throw new Error('Operación no permitida en versión Web');
    }
    if (availablePaths.find(i => i.url === rawUrl)) {
      throw new Error('El documento ya fue descargado');
    }
    console.log(`Iniciando descarga ${rawUrl}`);
    // Get data
    const fileURL = rawUrl; // Validaciones
    const fileHash = Md5.hashStr(fileURL);
    const filePath = `${File.dataDirectory}${fileHash}.pdf`;
    // Download
    try {
      await HTTP.downloadFile(fileURL, {}, {}, filePath);
      const newReference = {
        url: rawUrl,
        local: filePath
      }
      const next = availablePaths.concat([newReference]);
      localStorage.setItem('PATHS', JSON.stringify(next));
      setAvailablePaths(next);
      // Open
      await FileOpener.open(filePath, 'application/pdf');
    } catch (err) {
      console.error(err);
    }
  }

  const removeDocument = (rawUrl: string) => {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      throw new Error('Operación no permitida en versión Web');
    }
    console.log(`Eliminando ${rawUrl}`);
    const next = availablePaths.filter(i => i.url !== rawUrl);
    localStorage.setItem('PATHS', JSON.stringify(next));
    setAvailablePaths(next)
  }

  useEffect(() => {
    getPaths().then(i => setAvailablePaths(i));
  }, []);

  useEffect(() => {
    if (!mainData) {
      return
    }
    if (mainData.documents) {
      const availableUrls = availablePaths.map(i => i.url);
      setDocumentItems(mainData.documents.map(item => {
        return {
          name: item.name,
          url: item.url,
          offline: availableUrls.includes(item.url),
        }
      }))
    }
  }, [mainData, availablePaths]);

  return (
    <StoreContext.Provider value={{
      documents: documentItems,
      open: openDocument,
      download: downloadDocument,
      remove: removeDocument
    }}>
      {props.children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider;
