import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createUseStyles } from "react-jss";
import defaultImage from '../../assets/defaultImage.svg';

const useStyles = createUseStyles({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
        height: '100%',
        width: '100%',
    },
    button: {
        width: "100px",
        padding: "10px",
        margin: "5px 0",
        borderRadius: "5px",
        border: "1px solid #ccc",
        backgroundColor: "#31304D",
        color: "white",
        cursor: "pointer",
        transition: "transform 0.3s ease",
        "&:active": {
            transform: "scale(0.95)",
        },
        "&:hover": {
            backgroundColor: "#161A30",
        },
    },
    sortButtons: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
    },
    addButton: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
    },
    buttons: {
        display: 'flex',
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    childrenGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        padding: '1rem',
        width: '80%',
    },
    childCard: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: '#F0ECE5',
        borderRadius: '10px', 
        boxShadow: '0 0 15px 0 rgba(0, 0, 0, 0.1)', 
        textAlign: 'center',
        transition: 'transform 0.3s ease', 
        "&:hover": {
            transform: 'scale(1.05)',
            boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2)', 
        },
    },
    searchBar: {
        width: '80%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: 'none', 
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)', 
        fontSize: '1rem', 
        transition: 'box-shadow 0.3s ease', 
        '&:focus': {
            outline: 'none', 
            boxShadow: '0 0 15px 0 rgba(0, 0, 0, 0.2)', 
        },
    },
    sortButton: {
        width: "200px",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "5px",
        border: "1px solid #ccc",
        backgroundColor: "#31304D",
        color: "white",
        cursor: "pointer",
        transition: "transform 0.3s ease",
        "&:active": {
            transform: "scale(0.95)",
        },
        "&:hover": {
            backgroundColor: "#161A30",
        },
    },
    
    '@media (max-width: 768px)': {
        childrenGrid: {
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        },
        wrapper: {
            marginTop: '200px',
        },
        sortButtons: {
            flexDirection: 'column',
        }
    },
});

interface Child {
    id: number;
    name: string;
    surname: string;
    dateOfBirth: string; 
    image: string;
    dateOfAdmission: string;
}

function calculateAge(dateOfBirth: string): number {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dob > today) {
        return 0;}

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    return age;
}

const ChildrenContent = ({ refreshKey, onAddChild }: { refreshKey: number, onAddChild: () => void }) => {
    const classes = useStyles();
    const [searchTerm, setSearchTerm] = useState(''); 
    const [alphaSortOrder, setAlphaSortOrder] = useState(true);
    const [sortOrder, setSortOrder] = useState(true); 

    const [children, setChildren] = useState<Child[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/addChild/')
        .then(response => {
            setChildren(response.data);
        })
        .catch(error => {
            console.error('Błąd pobierania listy dzieci:', error);
        });
    }, [refreshKey]);

    const handleSort = () => {
        const sortedChildren = [...children].sort((a, b) => {
            const ageA = calculateAge(a.dateOfBirth);
            const ageB = calculateAge(b.dateOfBirth);
            return sortOrder ? ageA - ageB : ageB - ageA;
        });
        setChildren(sortedChildren);
        setSortOrder(!sortOrder);
    };

    const filteredChildren = children.filter(child =>
        `${child.name} ${child.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAlphaSort = () => {
        const sortedChildren = [...children].sort((a, b) => {
            const surnameA = a.surname.toLowerCase();
            const surnameB = b.surname.toLowerCase();
            if (alphaSortOrder) {
                if (surnameA < surnameB) return -1;
                if (surnameA > surnameB) return 1;
                return 0;
            } else {
                if (surnameA > surnameB) return -1;
                if (surnameA < surnameB) return 1;
                return 0;
            }
        });
        setChildren(sortedChildren);
        setAlphaSortOrder(!alphaSortOrder);
    };

    const handleDateSort = () => {
        const sortedChildren = [...children].sort((a, b) => new Date(a.dateOfAdmission).getTime() - new Date(b.dateOfAdmission).getTime());
        setChildren(sortedChildren);
    };

    return (
        <div className={classes.wrapper}>
            <h1>Lista dzieci</h1>
            <input
                type="text"
                placeholder="Szukaj po imieniu lub nazwisku"
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                className={classes.searchBar}
            />
            <div className={classes.buttons}>
                <div className={classes.sortButtons}>
                    <button className={classes.sortButton} onClick={handleSort}>Sortuj po wieku</button>
                    <button className={classes.sortButton} onClick={handleAlphaSort}>Sortuj alfabetycznie</button>
                    <button className={classes.sortButton} onClick={handleDateSort}>Sortuj po dacie przyjęcia</button>
                </div>
                <div>
                    <button className={`${classes.button} ${classes.addButton}`} onClick={onAddChild}>+</button>
                </div>
            </div>
            <div className={classes.childrenGrid}>
                {filteredChildren.map(child => (
                    <div key={child.id} className={classes.childCard}>
                        <img src={child.image || defaultImage} alt={`${child.name} ${child.surname}`} />
                        <h2>{child.name} {child.surname}</h2>
                        <p>Wiek: {calculateAge(child.dateOfBirth)}</p>
                        <div className={classes.buttons}>
                            <button className={classes.button}>Szczegóły</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChildrenContent;