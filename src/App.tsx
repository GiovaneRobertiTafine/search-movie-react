import React, { useState, useRef, useEffect, createRef, createContext } from "react";
import { fetchCertificao, fetchFaixaEtaria, fetchFilme, fetchGenres, fetchSearch, fetchTodos } from "./services";
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
    const [genres, setGenres] = useState<any[]>(null);

    useEffect(() => {
        getFaixaEtaria();
        getGeneros();
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

    }, [itens.length]);

    useEffect(() => {
        if (paginacao.page !== 1 && paginacao.page <= paginacao.totalPages) {
            valueSearch ? getValueSearch(valueSearch, paginacao.page) : getMoreTodos(paginacao.page);
        }
    }, [paginacao.page]);

    useEffect(() => {
        if (valueSearch?.length >= 2) {
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
            const generos: any = await fetchGenres();
            setGenres(generos.genres);
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
                            <input type="text" placeholder="" onChange={v => {
                                setValueSearch(v.target.value); setPaginacao((prev) => ({
                                    ...prev,
                                    page: 1,
                                }));
                            }} />

                            {/* <label htmlFor="search-filmes">Pesquisar filmes: (mín. 2 caracteres)</label> */}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: "0.8rem" }}>Genêros:</span>
                            <select name="" id="select-search-generos">
                                <option value={null}>Todos</option>
                                {
                                    genres?.map((v) => {
                                        return (
                                            <option key={v.id}>{v.name}</ option>
                                        );
                                    })
                                }
                            </select>
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
        </ FilmeContext.Provider>
    );
}

export default App;


