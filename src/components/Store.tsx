import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';

interface SimpleDocLink {
  name: string
  url: string
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
  open: (i: DocumentRef) => void
  download: (i: DocumentRef) => void
  remove: (i: DocumentRef) => void
}

const defaultStoreContext: StoreContextType = {
  documents: [],
  open: (i: DocumentRef) => {
    throw new Error('open not implemented')
  },
  download: (i: DocumentRef) => {
    throw new Error('download not implemented')
  },
  remove: (i: DocumentRef) => {
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

  const openDocument = (d: DocumentRef) => {
    console.log(`Abriendo ${d.url}`);
  }

  const downloadDocument = (d: DocumentRef) => {
    console.log(`Descargando ${d.url}`);
    const next = availablePaths.concat([{
      url: d.url,
      local: '...'
    }]);
    localStorage.setItem('PATHS', JSON.stringify(next));
    setAvailablePaths(next);
  }

  const removeDocument = (d: DocumentRef) => {
    console.log(`Eliminando ${d.url}`);
    const next = availablePaths.filter(i => i.url !== d.url);
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
