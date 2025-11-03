import { useEffect, useMemo, useState } from "react";
import Vault, { VaultImpl } from "../models/Vault/Vault";
import { VaultService } from "../services/VaultService";
import CopyService from "../services/impl/CopyService";
import CommsService from "../services/impl/CommsService";

type useVaultType = {
    vaults: Vault[];
    copy: (input: string[]) => Promise<void>;
    add: (texts: string[]) => void;
    deleteVault: (title: string) => void;
    activeVault: Vault;
    setActiveVault(vault: Vault): void;
}

export default function useVault(): useVaultType {

    const [count, setCount] = useState<number>(0);

    const [vaults, setVaults] = useState<Vault[]>([]);
    const [activeVault, setActiveVault] = useState<Vault>(null);
    const vaultService = useMemo(() => new VaultService(), []);
    const copyService = useMemo(() => new CopyService(new CommsService()), []);

    const copy = copyService.copy;

    const add = (texts: string[]) => {
        const [title, ...remaining] = texts;

        !activeVault ? vaultService.add({ title, texts: remaining }) : vaultService.modify({ title, texts: remaining });
        setActiveVault(null);
        setCount(prev => prev + 1);
    }

    const deleteVault = (title: string) => {
        vaultService.delete(title);
        setCount(prev => prev + 1);
    }

    useEffect(() => {
        let cancelled = false;
        if (!cancelled) {
            setVaults(vaultService.get());
        }

        return () => {
            cancelled = true;
        }
    }, [count])

    return { vaults, copy, add, deleteVault, activeVault, setActiveVault };
}