import "./actors.component.scss";

export interface Actors {
    filme: any;
    creditos: any;
    voltarModal: () => void;
}

function ActorsComponent({ filme, creditos, voltarModal }: Actors) {
    return (
        <div>
            <button id="modal-actors-voltar" onClick={() => voltarModal()}>
                Voltar
            </button>
            <div className="box-info-filmes">
                <h2>{filme.title}</h2>
                {/* <div className="thumb-filme" style={{ backgroundImage: "url(https://image.tmdb.org/t/p/w780" + filme.poster_path + ")" }} />
                <div>
                    <h2>{filme.title}</h2>
                    <h3>Crew:</h3>
                    <p style={{ fontSize: "0.75rem" }}>
                        {creditos?.crew?.map((c, i, arr) => {
                            return (
                                (i + 1) !== arr.length ?
                                    <span key={c.name}><strong>{c.job}: </strong>{c.name}, </span> :
                                    <span key={c.name}><strong>{c.job}: </strong>{c.name}.</span>
                            );
                        })}
                    </p>

                </div> */}
            </div>
            <h3 style={{ margin: "0 1.5rem" }}>Cast:</h3>
            <div id="box-actors">
                {creditos.cast.map((a, index) => {
                    return (
                        <div style={{ cursor: "pointer", position: "relative" }} key={index}>
                            {
                                a.profile_path ?
                                    <div className="thumb-actor" style={{ backgroundImage: "url(https://image.tmdb.org/t/p/w780" + a.profile_path + ")" }} /> :
                                    <div className="thumb-actor">{a.name} (sem imagem)</div>
                            }
                            <div className="thumb-actor-name">
                                {a.name} <br />
                                ({a.character})
                            </div>
                        </div>
                    );
                })}
            </div>
            <h3 style={{ margin: "0 1.5rem" }}>Crew:</h3>
            <div style={{ padding: "1.5rem", fontSize: "0.75rem" }}>
                {creditos?.crew?.map((c, i, arr) => {
                    return (
                        (i + 1) !== arr.length ?
                            <span key={i}><strong>{c.job}: </strong>{c.name}, </span> :
                            <span key={i}><strong>{c.job}: </strong>{c.name}.</span>
                    );
                })}
            </div>
        </div>
    );
}

export default ActorsComponent;