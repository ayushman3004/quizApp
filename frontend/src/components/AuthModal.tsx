import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme";
import { QuizVerseAPI } from "../services/api";

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, onAuthSuccess }) => {
  const [tab, setTab] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetForm = () => {
    setIdentifier("");
    setPassword("");
    setUsername("");
    setDisplayName("");
    setEmail("");
    setErrorMsg(null);
  };

  const handleLogin = async () => {
    if (!identifier.trim()) {
      setErrorMsg("Please enter your username or email");
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await QuizVerseAPI.login(identifier.trim(), password);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
        resetForm();
        onClose();
      } else {
        setErrorMsg(res.error || "Login failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username.trim() || !email.trim()) {
      setErrorMsg("Username and email are required");
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await QuizVerseAPI.register({
        username: username.trim(),
        displayName: displayName.trim() || username.trim(),
        email: email.trim(),
        password: password || undefined,
      });
      if (res.success && res.user) {
        onAuthSuccess(res.user);
        resetForm();
        onClose();
      } else {
        setErrorMsg(res.error || "Registration failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const guestName = "Challenger_" + Math.floor(100 + Math.random() * 900);
      const res = await QuizVerseAPI.guestLogin(guestName);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
        resetForm();
        onClose();
      } else {
        setErrorMsg(res.error || "Guest login failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Could not start guest session");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await QuizVerseAPI.login("AyaanMaster");
      if (res.success && res.user) {
        onAuthSuccess(res.user);
        resetForm();
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to login as Demo User");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={["#7C3AED", "#4C1D95"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerTop}>
              <View style={styles.headerLogoRow}>
                <Text style={styles.logoIcon}>⚡</Text>
                <Text style={styles.logoTitle}>QuizVerse</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.headerSubtitle}>
              {tab === "LOGIN"
                ? "Enter The Ring • Compete, Earn XP & Rank Up"
                : "Create Account • Get 250 Free Coins & Start MMR"}
            </Text>
          </LinearGradient>

          <View style={styles.contentBody}>
            {/* Tab Switcher */}
            <View style={styles.tabSwitcher}>
              <TouchableOpacity
                style={[styles.tabBtn, tab === "LOGIN" && styles.tabBtnActive]}
                onPress={() => {
                  setTab("LOGIN");
                  setErrorMsg(null);
                }}
              >
                <Text style={[styles.tabBtnText, tab === "LOGIN" && styles.tabBtnTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabBtn, tab === "REGISTER" && styles.tabBtnActive]}
                onPress={() => {
                  setTab("REGISTER");
                  setErrorMsg(null);
                }}
              >
                <Text style={[styles.tabBtnText, tab === "REGISTER" && styles.tabBtnTextActive]}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {errorMsg && (
              <View style={styles.errorAlert}>
                <Text style={styles.errorAlertText}>⚠️ {errorMsg}</Text>
              </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>
              {tab === "LOGIN" ? (
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Username or Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. AyaanMaster or user@quizverse.io"
                    placeholderTextColor="#64748B"
                    value={identifier}
                    onChangeText={setIdentifier}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#64748B"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />

                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleLogin}
                    disabled={loading}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={["#F59E0B", "#D97706"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.btnGradient}
                    >
                      {loading ? (
                        <ActivityIndicator color="#1E1B4B" />
                      ) : (
                        <Text style={styles.primaryBtnText}>SIGN IN & ENTER THE RING</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Username</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Choose a battle handle (e.g. Titan007)"
                    placeholderTextColor="#64748B"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <Text style={styles.inputLabel}>Display Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Your Name (e.g. Alex Sharma)"
                    placeholderTextColor="#64748B"
                    value={displayName}
                    onChangeText={setDisplayName}
                  />

                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="your.email@domain.com"
                    placeholderTextColor="#64748B"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Choose a strong password"
                    placeholderTextColor="#64748B"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />

                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleRegister}
                    disabled={loading}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={["#10B981", "#059669"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.btnGradient}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.primaryBtnTextLight}>CREATE ACCOUNT (+250 COINS)</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

              {/* Fast Track Options */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR PLAY INSTANTLY</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.quickOptions}>
                <TouchableOpacity
                  style={styles.quickBtn}
                  onPress={handleGuestLogin}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.quickBtnIcon}>⚡</Text>
                  <Text style={styles.quickBtnText}>Play as Guest (+100 Coins)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickBtn}
                  onPress={handleDemoLogin}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.quickBtnIcon}>👑</Text>
                  <Text style={styles.quickBtnText}>Demo Account (AyaanMaster • Lvl 11)</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  headerGradient: {
    padding: theme.spacing.lg,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  headerLogoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  logoTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
  contentBody: {
    padding: theme.spacing.lg,
  },
  tabSwitcher: {
    flexDirection: "row",
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    padding: 3,
    marginBottom: theme.spacing.md,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: theme.borderRadius.sm,
  },
  tabBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  tabBtnText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  tabBtnTextActive: {
    color: "#fff",
    fontWeight: "800",
  },
  errorAlert: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  errorAlertText: {
    color: "#FCA5A5",
    fontSize: 12,
    fontWeight: "600",
  },
  formScroll: {
    maxHeight: 380,
  },
  formGroup: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
    marginTop: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    color: theme.colors.textPrimary,
    fontSize: 14,
    marginBottom: 6,
  },
  primaryBtn: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  btnGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: "#1E1B4B",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  primaryBtnTextLight: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.surfaceBorder,
  },
  dividerText: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    marginHorizontal: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  quickOptions: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  quickBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.md,
  },
  quickBtnIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  quickBtnText: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
});
