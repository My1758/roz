import React, { useEffect, useState } from 'react';
import { createUseStyles } from "react-jss";
import Modal from "react-modal";
import { set, useForm } from "react-hook-form";
import axios from 'axios';
import InputField from './InputField';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

const useStyles = createUseStyles({
    form: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '1rem',
    },
    button: {
        padding: '10px',
        margin: '5px 0',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: '#31304D',
        color: 'white',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
        '&:active': {
          transform: 'scale(0.95)',
        },
        '&:hover': {
            backgroundColor: '#161A30',
          },
    },
    cancelBtn: {
        backgroundColor: '#ff3333',
        '&:hover': {
            backgroundColor: '#ff1a1a',
          },
    },
    h2:{
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '3rem',
    },
    messageBox: {
        display: 'flex',
        background: '#F0ECE5',
        border: '2px solid #31304D',
        borderRadius: '1rem',
        width: 'clamp(300px, 80%, 600px)',
        margin: '0 auto',
        padding: '20px',
        textAlign: 'center',
        fontSize: '1.5rem',
    },
    messageModal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
    },
    '@media (max-width: 768px)': {
        form: {
            display: 'flex',
            flexDirection: 'column',
        },
    
    },
});

const customModalStyles = {
    content: {
        background: '#F0ECE5',
        border: '2px solid #31304D',
        fontFamily: 'Arial, sans-serif',
        borderRadius: '2rem',
        width: 'clamp(300px, 80%, 600px)',
        margin: '0 auto',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: '2000',
    },
};

const MessageModal = ({ isOpen, message, isSuccess, onClose, }: { isOpen: boolean, message: string, isSuccess: boolean, onClose: () => void }) => {
        const classes = useStyles();
        const successStyle = { backgroundColor: '#228B22' };
        const failureStyle = { backgroundColor: '#ff3333' };

        useEffect(() => {
            if (isOpen) {
                const timer = setTimeout(onClose, 2000);
                return () => clearTimeout(timer);
            }
        }, [isOpen, onClose]);
    
        return (
            <Modal isOpen={isOpen} onRequestClose={onClose} className={classes.messageModal}>
                <div className={classes.messageBox} style={isSuccess ? successStyle : failureStyle}>
                    {message}
                </div>
            </Modal>
        );
};

const AddChildrenForm = ( { isOpen, onClose, onChildAdded }: { isOpen: boolean, onClose: () => void, onChildAdded: () => void } ) => {
    const classes = useStyles();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [page, setPage] = useState(1);
    const [isMessageModalOpen, setMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const onSubmit = (data : any) => {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        axios.post('http://localhost:8000/api/addChild/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
          .then(response => {
            handleClose();
            onChildAdded();
            setMessage('Dziecko zostało dodane');
            setIsSuccess(true);
            setMessageModalOpen(true);
          })
          .catch(error => {
            handleClose();
            setMessage('Nie udało się dodać dziecka:');
            setIsSuccess(false);
            setMessageModalOpen(true);
          });
      };

      const handleClose = () => {
        reset();
        setPage(1);
        onClose();
      }

      const onNextPage = () => {
        setPage(2);
      };

      const onPrevPage = () => {
        setPage(1);
      };

    return (
        <>
            <Modal isOpen={isOpen} onRequestClose={handleClose} style={customModalStyles}>
                <h2 className={classes.h2}>Dodaj Dziecko</h2>
                <form id="addChildForm" onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                    {page === 1 && (
                        <>
                            <InputField
                                label="Imię"
                                register={register('name', { required: true })}
                                error={!!errors.name}
                                errorMessage="To pole jest wymagane"
                                type="text"
                            />
                            <InputField
                                label="Nazwisko"
                                register={register('surname', { required: true })}
                                error={!!errors.surname}
                                errorMessage="To pole jest wymagane"
                                type="text"
                            />
                            <InputField
                                label="Data urodzenia"
                                register={register('dateOfBirth', { required: true })}
                                error={!!errors.dateOfBirth}
                                errorMessage="To pole jest wymagane"
                                type="date"
                            />
                            <InputField
                                label="Miejsce urodzenia"
                                register={register('placeOfBirth', { required: true })}
                                error={!!errors.placeOfBirth}
                                errorMessage="To pole jest wymagane"
                                type="text"
                            />
                            <InputField
                                label="Data przyjęcia"
                                register={register('dateOfAdmission', { required: true })}
                                error={!!errors.dateOfAdmission}
                                errorMessage="To pole jest wymagane"
                                type="date"
                            />
                            <InputField
                                label="Numer skierowania"
                                register={register('referralNumber', { required: true })}
                                error={!!errors.referralNumber}
                                errorMessage="To pole jest wymagane"
                                type="text"
                            />
                            <button type="button" className={`${classes.button} ${classes.cancelBtn}`} onClick={handleClose}>Anuluj</button>
                            <div className={classes.buttonsContainer}>
                                <FaArrowAltCircleLeft onClick={onPrevPage} size={30} style={{cursor: 'pointer'}}/>
                                <p style={{fontWeight: 'bold'}}>{page}/2</p>
                                <FaArrowAltCircleRight onClick={onNextPage} size={30} style={{cursor: 'pointer'}}/>
                            </div>
                        </>
                    )}
                    {page === 2 && (
                        <>
                            <InputField
                                label="Matka"
                                register={register('mother', { required: true })}
                                error={!!errors.mother}
                                errorMessage="To pole jest wymagane"
                                type="text"
                            />
                            <InputField
                                label="Ojciec"
                                register={register('father', { required: true })}
                                error={!!errors.father}
                                errorMessage="To pole jest wymagane"
                                type="text"
                            />
                            <InputField
                                label="Opiekun prawny"
                                register={register('legalGuardian', { required: true })}
                                error={!!errors.legalGuardian}
                                errorMessage="To pole jest wymagane"
                                type="text"
                            />
                            <InputField
                                label="Rodzeństwo"
                                register={register('siblings', { required: true })}
                                error={!!errors.siblings}
                                errorMessage="To pole jest wymagane"
                                type="number"
                            />
                            <InputField
                                label="Uwagi"
                                register={register('comments', { required: true })}
                                error={!!errors.legalGuardian}
                                errorMessage="To pole jest wymagane"
                                type="textarea"
                            />
                            {/* <InputField
                                label="Zdjęcie"
                                register={register('image', { required: false })}
                                error={!!errors.legalGuardian}
                                errorMessage="To pole jest wymagane"
                                type="file"
                            // /> */}
                            <div className={classes.buttonsContainer}>
                                <button type="button" className={`${classes.button} ${classes.cancelBtn}`} onClick={handleClose}>Anuluj</button>
                                <button type="submit" form="addChildForm" className={classes.button}>Dodaj</button>
                            </div>
                            <div className={classes.buttonsContainer}>
                                <FaArrowAltCircleLeft onClick={onPrevPage} size={30} style={{cursor: 'pointer'}}/>
                                <p style={{fontWeight: 'bold'}}>{page}/2</p>
                                <FaArrowAltCircleRight onClick={onNextPage} size={30} style={{cursor: 'pointer'}}/>
                            </div>
                        </>
                    )}     
                </form>
            </Modal>

            <MessageModal isOpen={isMessageModalOpen} message={message} isSuccess={isSuccess} onClose={() => setMessageModalOpen(false)} />
        </>
    );

};

export default AddChildrenForm;