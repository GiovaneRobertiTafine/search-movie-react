import React, { useState, useRef, useEffect, createRef, createContext } from "react";
import { fetchCertificao, fetchFaixaEtaria, fetchFilme, fetchGenreSelected, fetchGenres, fetchSearch, fetchTodos } from "./services";
import './App.scss';
import ModalComponent from "./components/modal/modal.component";
import { FilmeContext, CertificacaoContext } from "./contexts/index.context";

function App() {
    const lastRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [itens, setItens] = useState<any[]>([]);
    const [paginacao, setPaginacao] = useState({
        page: 1,
        totalPages: 0
    });
    const [valueSearch, setValueSearch] = useState(null);
    const [timer, setTimer] = useState(null);
    const [filme, setFilme] = useState<any>(null);
    const [certificacao, setCertificacao] = useState<any[]>(null);
    const valueFilme = { filme, setFilme };
    const valueCertificacao = { certificacao };
    const [generos, setGeneros] = useState<any[]>(null);
    const [generoSelecionado, setGeneroSelecionado] = useState<any>(null);

    useEffect(() => {
        getFaixaEtaria();
        getGeneros();
        window.addEventListener('resize', (event) => {
            if (getComputedStyle(document.getElementById('box-select-search-generos')).getPropertyValue('display') === 'grid' && window.innerWidth <= 500) {
                // document.documentElement.style.overflow = 'hidden';
                document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
                window.scrollTo(0, 0);
                document.getElementById('close-select-search-generos').style.display = 'block';
            } else if (window.innerWidth > 500) {
                // document.documentElement.style.overflow = 'auto';
                document.getElementsByTagName('body')[0].style.overflowY = 'auto';
                document.getElementById('close-select-search-generos').style.display = 'none';
            }
        });
        window.addEventListener('click', (event) => {
            if (event.composedPath().indexOf(document.querySelector('#select-search-generos')) < 0) {
                document.getElementById('box-select-search-generos').style.display = 'none';
                // document.documentElement.style.overflow = 'auto';
                document.getElementsByTagName('body')[0].style.overflowY = 'auto';
                document.getElementById('close-select-search-generos').style.display = 'none';
            } else {
                if (getComputedStyle(document.getElementById('box-select-search-generos')).getPropertyValue('display') === 'none') {
                    document.getElementById('box-select-search-generos').style.display = 'grid';
                    if (window.innerWidth <= 500) {
                        // document.documentElement.style.overflow = 'hidden';
                        document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
                        window.scrollTo(0, 0);
                        document.getElementById('close-select-search-generos').style.display = 'block';
                    };
                } else {
                    // document.documentElement.style.overflow = 'auto';
                    document.getElementsByTagName('body')[0].style.overflowY = 'auto';
                    document.getElementById('box-select-search-generos').style.display = 'none';
                    document.getElementById('close-select-search-generos').style.display = 'none';
                }
            }

        });

    }, []);

    useEffect(() => {
        // Fetch no mount da página.
        if (itens.length && lastRef) {
            const intersectionObserver = new IntersectionObserver(([entries]) => {
                if (entries.isIntersecting) {
                    setPaginacao((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                    }));

                }
            });

            intersectionObserver.observe(lastRef.current);
        } else {
            getMoreTodos(paginacao.page);

        }

    }, [itens]);

    useEffect(() => {
        if (paginacao.page !== 1 && paginacao.page <= paginacao.totalPages) {
            if (valueSearch) getValueSearch(valueSearch, paginacao.page);
            if (generoSelecionado) getGeneroSelecionado(paginacao.page);
            if (!valueSearch && !generoSelecionado) getMoreTodos(paginacao.page);
        }
    }, [paginacao.page]);

    useEffect(() => {
        if (valueSearch?.length >= 2) {
            setGeneroSelecionado(0);
            setIsLoading(true);
            clearTimeout(timer);
            setTimer(
                setTimeout(() => {
                    getValueSearch(valueSearch, paginacao.page);
                    setIsLoading(false);
                }, 3000)
            );

        } else if (!valueSearch && valueSearch !== null) {
            clearTimeout(timer);
            getMoreTodos(paginacao.page);
        }

    }, [valueSearch]);

    // const handlerValueSearch = () => {
    //     if (valueSearch?.length >= 2) {
    //         setGeneroSelecionado(null);
    //         setIsLoading(true);
    //         clearTimeout(timer);
    //         setTimer(
    //             setTimeout(() => {
    //                 getValueSearch(valueSearch, paginacao.page);
    //                 setIsLoading(false);
    //             }, 3000)
    //         );

    //     } else if (!valueSearch && valueSearch !== null) {
    //         clearTimeout(timer);
    //         getMoreTodos(paginacao.page);
    //     }
    // };

    useEffect(() => {
        if (itens.length > 0 && generoSelecionado !== 0) {
            setValueSearch(null);
            if (!generoSelecionado) getMoreTodos(paginacao.page);
            if (generoSelecionado) getGeneroSelecionado(paginacao.page);
        }
    }, [generoSelecionado]);

    // const handlerGeneroSelecionado = () => {
    //     if (itens.length > 0) {
    //         setValueSearch(null);
    //         console.log(generoSelecionado);
    //         if (!generoSelecionado) getMoreTodos(paginacao.page);
    //         if (generoSelecionado) getGeneroSelecionado(paginacao.page);
    //     }
    // };

    const getMoreTodos = async (page: number) => {
        try {
            setIsLoading(true);
            const newTodos: any = await fetchTodos(page);
            setItens((prev) => page > 1 ? prev.concat(newTodos.results) : prev = newTodos.results);
            setPaginacao((prev) => ({ ...prev, totalPages: newTodos.total_pages }));
            setIsLoading(false);
        } catch (err) { }
    };

    const getValueSearch = async (valueSearch: string, page: number) => {
        try {
            const newTodos: any = await fetchSearch(valueSearch, page);
            setItens((prev) => page > 1 ? prev.concat(newTodos.results) : prev = newTodos.results);
            setPaginacao((prev) => ({ ...prev, totalPages: newTodos.total_pages }));
        } catch (err) { }
    };

    const getFaixaEtaria = async () => {
        try {
            const certificacao: any = await fetchCertificao();
            setCertificacao(certificacao.certifications.BR);
        } catch (err) { }
    };

    const getGeneros = async () => {
        try {
            const generosTodos: any = await fetchGenres();
            setGeneros(generosTodos.genres);
        } catch (error) { }
    };

    const getGeneroSelecionado = async (page: number) => {
        try {
            const newTodos: any = await fetchGenreSelected(generoSelecionado.id, page);
            setItens((prev) => page > 1 ? prev.concat(newTodos.results) : prev = newTodos.results);
            setPaginacao((prev) => ({ ...prev, totalPages: newTodos.total_pages }));
        } catch (error) { }
    };

    const handlerModal = async (filmeId: number) => {
        try {
            setIsLoading(true);
            const filme: any = await fetchFilme(filmeId);
            setFilme(filme);
            setIsLoading(false);
        } catch (err) { }
    };

    const handlerCloseModal = (closeModal: boolean) => {
        if (closeModal) setFilme(null);
    };

    return (
        <FilmeContext.Provider value={valueFilme}>
            <CertificacaoContext.Provider value={valueCertificacao}>
                <div>
                    {filme && <ModalComponent closeModal={handlerCloseModal} />}
                    <h2>Lorem ipsum's list</h2>
                    <div id="box-search-filmes">
                        <div id="search-filmes">
                            <span style={{ fontSize: "0.8rem" }}>Pesquisar filmes: (mín. 2 caracteres)</span>
                            <input type="text" placeholder="" value={valueSearch ?? ''} onChange={v => {
                                setValueSearch(v.target.value);
                                setPaginacao((prev) => ({
                                    ...prev,
                                    page: 1,
                                }));
                                // handlerValueSearch();
                            }} />

                            {/* <label htmlFor="search-filmes">Pesquisar filmes: (mín. 2 caracteres)</label> */}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: "0.8rem" }}>Genêros:</span>
                            <button id="close-select-search-generos">
                                Fechar
                            </button>
                            <button id="select-search-generos" onClick={() => {

                            }}>
                                <span>{generoSelecionado ? generoSelecionado.name : 'Todos'}</span>
                                <div id="box-select-search-generos">
                                    <span onClick={() => {
                                        setGeneroSelecionado(null);
                                        setPaginacao((prev) => ({
                                            ...prev,
                                            page: 1,
                                        }));
                                        // handlerGeneroSelecionado();
                                    }} key={'0'}>Todos</span>
                                    {
                                        generos?.map((v) => {
                                            return (
                                                <span key={v.id} onClick={() => {
                                                    setGeneroSelecionado(v);
                                                    setPaginacao((prev) => ({
                                                        ...prev,
                                                        page: 1,
                                                    }));
                                                    // handlerGeneroSelecionado();
                                                }
                                                }>{v.name}</ span>
                                            );
                                        })
                                    }

                                </div>
                            </button>
                        </div>
                    </div>
                    <div style={{ margin: '1rem 1rem 0rem 1rem' }}>
                        {isLoading && <p>Loading...</p>}

                    </div>
                    <div id="box-filmes">
                        {itens.map((filme, index) => {
                            return (
                                <div style={{ cursor: "pointer" }} key={filme.id} onClick={() => handlerModal(filme.id)}>
                                    {
                                        filme.poster_path ?
                                            <div className="thumb-filme" style={{ backgroundImage: "url(https://image.tmdb.org/t/p/w780" + filme.poster_path + ")" }} /> :
                                            <div className="thumb-filme">{filme.title} (sem imagem)</div>
                                    }
                                </div>
                            );
                        })}

                    </div>
                    {!!itens.length && <div style={{ height: "10px" }} ref={lastRef} />}

                    {isLoading && <p>Loading...</p>}
                </div>
            </CertificacaoContext.Provider>
        </ FilmeContext.Provider >
    );
}

export default App;


