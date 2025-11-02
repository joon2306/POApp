import { useEffect, useMemo, useState } from "react";
import Vault from "../models/Vault/Vault";
import { VaultService } from "../services/VaultService";

export default function useVault(): {vaults: Vault[]} {

    const [vaults, setVaults] = useState<Vault[]>([]);
    const vaultService = useMemo(() => new VaultService(), []);

    useEffect(() => {
        let cancelled = false;
        if (!cancelled) {
            setVaults(vaultService.get());
        }

        return () => {
            cancelled = true;
        }
    }, [vaultService])

    return { vaults };
}