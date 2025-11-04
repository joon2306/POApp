import { useEffect, useMemo, useState } from "react";
import Vault, { VaultImpl } from "../models/Vault/Vault";
import { VaultService } from "../services/VaultService";
import CopyService from "../services/impl/CopyService";
import CommsService from "../services/impl/CommsService";
import UniqueVaultService from "../services/impl/UniqueVaultService";
import TokenService from "../services/impl/TokenService";

type useVaultType = {
    vaults: Vault[];
    copy: (input: string[]) => Promise<void>;
    add: (texts: string[]) => void;
    deleteVault: (title: string) => void;
    activeVault: Vault;
    setActiveVault(vault: Vault): void;
    executeUniqueVault(id: string): Promise<void>;
}

export default function useVault(): useVaultType {

    const [count, setCount] = useState<number>(0);

    const [vaults, setVaults] = useState<Vault[]>([]);
    const [activeVault, setActiveVault] = useState<Vault>(null);
    const uniqueVaultService = useMemo(() => new UniqueVaultService(), []);
    const commsService = useMemo(() => new CommsService(), []);
    const tokenService = useMemo(() => new TokenService(commsService), []);
    const vaultService = useMemo(() => new VaultService(uniqueVaultService, tokenService, commsService), []);
    const copyService = useMemo(() => new CopyService(commsService), []);

    const copy = copyService.copy;

    const add = (texts: string[]) => {
        const [title, ...remaining] = texts;

        !activeVault ? vaultService.add({ title, texts: remaining, uniqueVault: false }) : vaultService.modify({ title, texts: remaining, uniqueVault: false });
        setActiveVault(null);
        setCount(prev => prev + 1);
    }

    const deleteVault = (title: string) => {
        vaultService.delete(title);
        setCount(prev => prev + 1);
    }

    const executeUniqueVault = async (id: string) => {
        await uniqueVaultService.execute(id);
    }

    useEffect(() => {
        let cancelled = false;
        if (!cancelled) {
            vaultService.get().then(vaults => !cancelled && setVaults(vaults));
        }

        return () => {
            cancelled = true;
        }
    }, [count])

    return { vaults, copy, add, deleteVault, activeVault, setActiveVault, executeUniqueVault };
}