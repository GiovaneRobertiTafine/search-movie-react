import { useContext, useEffect, useState } from "react";
import { fetchListaRecomendacoes } from "../../services";
import "./lista-recomendacoes.component.scss";
import { FilmeContext } from "../../contexts/index.context";

export interface ListaRecomendacoes {
    idFilme: number;
}

function ListaRecomendacoesComponent({ idFilme }: ListaRecomendacoes) {
    const [itens, setItens] = useState<any[]>([]);
    const { filme, setFilme } = useContext(FilmeContext);

    useEffect(() => {
        getListaRecomendacoes(idFilme);
    }, [idFilme]);

    const getListaRecomendacoes = async (idFilme: number) => {
        try {
            const newTodos: any = await fetchListaRecomendacoes(idFilme);
            setItens(newTodos.results);
        } catch (err) { }
    };


    return (
        <div className="box-lista-recomendacoes">
            {itens?.map((filme, index) => {
                return (
                    <div style={{ cursor: "pointer" }} key={filme.id}>
                        {
                            filme.poster_path ?
                                <div className="img-filme" onClick={() => { setFilme(filme); document.getElementById('back-drop').scrollTo(0, 0); }} style={{ backgroundImage: "url(https://image.tmdb.org/t/p/w780" + filme.poster_path + ")" }} /> :
                                <div className="img-filme">{filme.title} (sem imagem)</div>
                        }
                    </div>
                );
            })}
        </div>
    );
}

export default ListaRecomendacoesComponent;