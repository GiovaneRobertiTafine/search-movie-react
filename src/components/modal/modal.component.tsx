import { useEffect, useMemo, useState } from "react";
import "./modal.component.scss";
import { fetchCredits } from "../../services";

interface Modal {
    filme: any;
    closeModal: (arg0: boolean) => void;
}

function ModalComponent({ filme, closeModal }: Modal) {
    const [creditos, setCreditos] = useState(null);

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



    return (
        <div id="back-drop">
            <div id="modal">
                <div id="filme-info">
                    <h2>{filme.title}</h2>
                    <div>
                        <small>
                            {filme.release_date.substring(5, 7)}/
                            {filme.release_date.substring(0, 4)}
                        </small>
                    </div>
                    <p style={{ margin: "10px 0" }}>{filme.overview}</p>
                    <span><strong>Rating: </strong>{filme.vote_average.toFixed(2)} ({filme.vote_count})</span>
                    <div style={{ margin: "10px 0" }}><strong>Genêros: </strong>
                        {
                            filme.genres.map((g, i, arr) => {
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
                                            <span key={c.id}>{c.name}...</span>
                                    );
                                }
                            })
                        }
                    </div>
                </div>
                <div id="poster" style={{ backgroundImage: "url(https://image.tmdb.org/t/p/w780" + filme.backdrop_path + ")" }}>
                </div>
                <button id="modal-header">
                    Fechar
                </button>
                {/* <div id="modal-tab">
                    <button className="btn-tab active">Filme Relacionado</button>
                    <button className="btn-tab">Trailers</button>

                </div> */}
            </div>
        </div >
    );
}

export default ModalComponent;