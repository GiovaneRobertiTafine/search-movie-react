import { useContext, useEffect, useMemo, useState } from "react";
import "./modal.component.scss";
import { fetchCertificao, fetchCredits, fetchFaixaEtaria } from "../../services";
import { CertificacaoContext, FilmeContext } from "../../contexts/index.context";
import ActorsComponent from "../actors/actors.component";
import ListaRecomendacoesComponent from "../lista-recomendacoes/lista-recomendacoes.component";
import TrailerComponent from "../trailer/trailer.component";
import PlayerTrailerComponent from "../player-trailer/player-trailer.component";
interface Modal {
    closeModal: (arg0: boolean) => void;
}

interface FaixaEtaria {
    valor: string;
    descricao: string[];
    significado: string;
}

function ModalComponent({ closeModal }: Modal) {
    const [creditos, setCreditos] = useState(null);
    const [modalTab, setModalTab] = useState<'recomendacoes' | 'trailers'>('recomendacoes');
    const [actorsModal, setActorsModal] = useState(false);
    const [playerTrailerModal, setPlayerTrailerModal] = useState<string>(null);
    const { filme, setFilme } = useContext(FilmeContext);
    const [faixaEtaria, setFaixaEtaria] = useState<FaixaEtaria>();
    const { certificacao } = useContext(CertificacaoContext);

    const runTime = useMemo(() => {
        let hour = (filme.runtime / 60).toFixed();
        let minute = filme.runtime % 60;
        return hour ? hour + "h " + minute + "min" : minute + "min";
    }, [filme]);

    const listDirectors = useMemo(() => {
        return creditos?.crew.filter((c, i, arr) => c.job === "Director");
    }, [creditos]);

    const listWriters = useMemo(() => {
        return creditos?.crew.filter((c, i, arr) => c.job === "Writer");
    }, [creditos]);

    useEffect(() => {
        document.documentElement.style.overflow = 'hidden';
        getCredits();
        getFaixaEtaria();
        window.onclick = e => {
            if ((e.target as HTMLElement).id === "back-drop" || (e.target as HTMLElement).id === "modal-header") {
                closeModal(true);
                document.documentElement.style.overflow = 'auto';
            }
        };
    }, [filme]);

    const getCredits = async () => {
        try {
            const creditos: any = await fetchCredits(filme.id);
            setCreditos(creditos);
        } catch (err) { }
    };

    const getFaixaEtaria = async () => {
        try {
            let result: any = await fetchFaixaEtaria(filme.id);
            result = (result.results as []).filter(v => v['iso_3166_1'] === "BR")[0];
            setFaixaEtaria({
                valor: result.release_dates[0].certification,
                descricao: result.release_dates[0].descriptors,
                significado: certificacao.filter(v => v.certification === result.release_dates[0].certification)[0].meaning
            });
            console.log(faixaEtaria);
        } catch (err) { }
    };

    return (
        <div id="back-drop">
            <div className={"modal " + (playerTrailerModal && "player-trailer")}>
                {(() => {
                    if (!actorsModal && !playerTrailerModal) {
                        return <div>
                            <div id="filme-info">
                                <div id="filme-descricao">
                                    <h2>{filme.title}</h2>
                                    <div style={{ display: "flex", gap: "5px", alignItems: "center", marginTop: "7px" }}>
                                        <small>
                                            {filme?.release_date.substring(5, 7)}/
                                            {filme?.release_date.substring(0, 4)}
                                        </small>
                                        <div style={{ marginLeft: "10px" }} className={"faixa-etaria faixa-" + faixaEtaria?.valor}>
                                            {faixaEtaria?.valor}

                                        </div>
                                        <div className="faixa-etaria-info">!
                                            <div>
                                                <strong>
                                                    {faixaEtaria?.descricao.map((v, i, arr) => {
                                                        return (
                                                            (i + 1) !== arr.length ?
                                                                <span key={v}>{v}, </span> :
                                                                <span key={v}>{v}.</span>
                                                        );
                                                    })}
                                                </strong>

                                                {faixaEtaria?.significado}
                                            </div>
                                        </div>
                                    </div>
                                    <p style={{ margin: "10px 0" }}>{filme.overview}</p>
                                    <span><strong>Rating: </strong>{filme.vote_average.toFixed(2)} ({filme.vote_count})</span>
                                    <div style={{ margin: "10px 0" }}><strong>Genêros: </strong>
                                        {
                                            filme.genres?.map((g, i, arr) => {
                                                return (
                                                    (i + 1) !== arr.length ?
                                                        <span key={g.id}>{g.name}, </span> :
                                                        <span key={g.id}>{g.name}.</span>
                                                );
                                            })
                                        }
                                    </div>
                                    <span><strong>Run Time: </strong>{runTime}</span>
                                    <div style={{ margin: "10px 0" }}><strong>Director: </strong>
                                        {
                                            listDirectors?.map((c, i, arr) => {
                                                return (
                                                    (i + 1) !== arr.length ?
                                                        <span key={c.id}>{c.name}, </span> :
                                                        <span key={c.id}>{c.name}.</span>
                                                );
                                            })
                                        }
                                    </div>
                                    {listWriters?.length ? <div style={{ margin: "10px 0" }}><strong>Writers: </strong>
                                        {
                                            listWriters?.map((w, i, arr) => {
                                                return (
                                                    (i + 1) !== arr.length ?
                                                        <span key={w.id}>{w.name}, </span> :
                                                        <span key={w.id}>{w.name}.</span>
                                                );
                                            })
                                        }
                                    </div> : null}
                                    <div style={{ margin: "10px 0" }}>
                                        <strong>Actors: </strong>
                                        {
                                            creditos?.cast.map((c, i, arr) => {
                                                if (i <= 5) {
                                                    return (
                                                        i !== 5 ?
                                                            <span key={c.id}>{c.name}, </span> :
                                                            <span key={c.id}>{c.name}...
                                                                <button className="btn-mais" onClick={() => setActorsModal(true)}>mais</button>
                                                            </span>
                                                    );
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                                <div id="poster" style={{ backgroundImage: "url(https://image.tmdb.org/t/p/w780" + filme.backdrop_path + ")" }}>
                                </div>
                            </div>
                            <div id="modal-tab">
                                <button className={"btn-tab " + (modalTab === "recomendacoes" ? "active" : "")} onClick={() => setModalTab('recomendacoes')}>Filmes Relacionados</button>
                                <button className={"btn-tab " + (modalTab === "trailers" ? "active" : "")} onClick={() => setModalTab('trailers')}>Trailers</button>

                            </div>
                            <div>
                                {
                                    modalTab === 'recomendacoes' ?
                                        <ListaRecomendacoesComponent idFilme={filme.id} /> :
                                        <TrailerComponent idFilme={filme.id} playerTrailer={(idTrailer: string) => { setPlayerTrailerModal(idTrailer); }} />
                                }
                            </div>
                        </div>
                            ;
                    } else if (actorsModal) {
                        return <ActorsComponent filme={filme} creditos={creditos} voltarModal={() => setActorsModal(false)} />;
                    } else if (playerTrailerModal) {
                        return <PlayerTrailerComponent idTrailer={playerTrailerModal} voltarModal={() => setPlayerTrailerModal(null)} />;
                    }

                })()}
                <button id="modal-header">
                    Fechar
                </button>
            </div>
        </div >
    );
}

export default ModalComponent;