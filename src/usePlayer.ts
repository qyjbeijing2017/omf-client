import { useNavigate } from "react-router-dom";
import { Player } from "./player";
import { useEffect } from "react";

export function usePlayer() {
    const navigate = useNavigate();
    const player = new Player();
    useEffect(() => {
        if (!player.authenticated) {
            navigate('/signIn');
        }
    },[player.authenticated, navigate])
    return player
}