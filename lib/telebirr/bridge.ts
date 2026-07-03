/**
 * telebirr SuperApp (Mini App) bridge adapter.
 *
 * The mini app runs inside the telebirr SuperApp which injects a global
 * `consumerapp` object. When the same page is opened in a plain browser
 * (not inside telebirr) the bridge is absent, so every call here falls
 * back gracefully to ordinary web behaviour.
 */

declare global {
  interface Window {
    consumerapp?: {
      evaluate: (payload: string) => void;
    };
    handleinitDataCallback?: () => void;
    my?: {
      tradePay?: (opts: any) => void;
      getAuthCode?: (opts: any) => void;
    };
  }
}

/** True when running inside the telebirr SuperApp container. */
export function isInTelebirrSuperApp(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  // Check for consumerapp (telebirr mini-app) or my (Ant/Macle)
  return (
    typeof window.consumerapp?.evaluate === "function" ||
    typeof window.my?.tradePay === "function" ||
    /telebirr|superapp|miniprogram/i.test(ua)
  );
}

/**
 * Obtain a SuperApp auth code for login. Resolves to null when not running
 * inside telebirr (callers should fall back to the normal guest/auth flow).
 */
export function getTelebirrAuthCode(): Promise<string | null> {
  return new Promise((resolve) => {
    const my = typeof window !== "undefined" ? window.my : undefined;
    if (!my?.getAuthCode) {
      resolve(null);
      return;
    }
    my.getAuthCode({
      scopes: "auth_user",
      success: (res: { authCode: string }) => resolve(res?.authCode ?? null),
      fail: () => resolve(null),
    });
  });
}

export type TelebirrPayResult = "success" | "cancelled" | "failed";

// Store resolve function for callback
let paymentResolve: ((result: TelebirrPayResult) => void) | null = null;

/**
 * Start a telebirr payment for the given backend-issued rawRequest string.
 * Inside the SuperApp this invokes the native payment modal via consumerapp.evaluate;
 * in a plain browser it falls back to opening the H5 payment URL.
 */
export function startTelebirrPay(rawRequest: string): Promise<TelebirrPayResult> {
  return new Promise((resolve) => {
    console.log("startTelebirrPay called");
    console.log("rawRequest:", rawRequest?.substring(0, 100));
    
    // Check for consumerapp (telebirr mini-app)
    if (typeof window !== "undefined" && window.consumerapp?.evaluate) {
      console.log("Using consumerapp.evaluate for telebirr mini-app");
      
      // Store resolve function for callback
      paymentResolve = resolve;
      
      // Set up callback function
      window.handleinitDataCallback = function() {
        console.log("handleinitDataCallback triggered - payment completed");
        if (paymentResolve) {
          paymentResolve("success");
          paymentResolve = null;
        }
      };
      
      // Build the payload for consumerapp
      const payload = JSON.stringify({
        functionName: "js_fun_start_pay",
        params: {
          rawRequest: rawRequest,
          functionCallBackName: "handleinitDataCallback",
        },
      });
      
      console.log("Invoking consumerapp.evaluate with payload:", payload);
      
      try {
        window.consumerapp.evaluate(payload);
        // Don't resolve here - wait for callback
        return;
      } catch (err) {
        console.error("consumerapp.evaluate failed:", err);
        resolve("failed");
        return;
      }
    }
    
    // Check for my.tradePay (Ant/Macle - fallback)
    const my = typeof window !== "undefined" ? window.my : undefined;
    if (my?.tradePay) {
      console.log("Using my.tradePay (Ant/Macle fallback)");
      my.tradePay({
        orderStr: rawRequest,
        success: (res: { resultCode: string }) => {
          if (res?.resultCode === "9000") resolve("success");
          else if (res?.resultCode === "6001") resolve("cancelled");
          else resolve("failed");
        },
        fail: (err: unknown) => {
          console.error("tradePay failed:", err);
          resolve("failed");
        },
      });
      return;
    }

    // Plain-web fallback: open the H5 payment page
    if (typeof window !== "undefined" && rawRequest) {
      console.log("Using web fallback - opening H5 payment page");
      const h5BaseUrl = "https://developerportal.ethiotelebirr.et:38443/payment/web/paygate?";
      const fullUrl = rawRequest.startsWith("http") ? rawRequest : h5BaseUrl + rawRequest;
      window.open(fullUrl, "_blank");
      resolve("success");
      return;
    }

    console.log("No payment method available");
    resolve("failed");
  });
}
