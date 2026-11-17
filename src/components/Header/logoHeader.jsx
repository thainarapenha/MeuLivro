import { useState } from "react";

import branco from "@/assets/logo_livraria_branco.png";
import preto from "@/assets/logo_livraria_preto.png";

export const Logo = () => {
  const [over, setOver] = useState(false);
  return (
    <div
      onMouseOver={() => setOver(true)}
      onMouseOut={() => setOver(false)}
      className="flex items-center gap-3"
    >
      <img
        className="h-11 w-11 object-contain"
        src={over ? branco : preto}
        alt=""
      />

      <h1 className="text-xl font-black tracking-tight">Meu livro</h1>
    </div>
  );
};
