import { useState } from "react";
import ChildrenContent from "./ChildrenContent";
import AddChildrenForm from "./AddChildrenForm";

const Content = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); 

  const handleChildAdded = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <>
      <ChildrenContent refreshKey={refreshKey} onAddChild={() => setIsOpen(true)} />
      <AddChildrenForm isOpen={isOpen} onClose={() => setIsOpen(false)} onChildAdded={handleChildAdded} />
    </>
  );
};

export default Content;