"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

type ActionToastState = {
  message?: string;
  status?: "error" | "success";
};

export function useActionToast(
  state: ActionToastState,
  pending: boolean,
) {
  const completedSubmission = useRef(false);

  useEffect(() => {
    if (pending) {
      completedSubmission.current = true;
      return;
    }

    if (!completedSubmission.current) {
      return;
    }

    completedSubmission.current = false;

    if (!state.message || !state.status) {
      return;
    }

    if (state.status === "success") {
      toast.success(state.message);
      return;
    }

    toast.error(state.message);
  }, [pending, state.message, state.status]);
}
