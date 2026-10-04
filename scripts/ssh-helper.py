#!/usr/bin/env python3
"""SSH helper to execute commands on the Hostinger server."""
import sys
import paramiko

# Load credentials from .secrets
SECRETS_FILE = "/home/z/my-project/.secrets/ssh-creds"
creds = {}
with open(SECRETS_FILE) as f:
    for line in f:
        line = line.strip()
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            creds[k] = v

HOST = creds["HOST"]
PORT = int(creds["PORT"])
USER = creds["USER"]
PASSWORD = creds["PASSWORD"]

def run_remote(cmd, timeout=180):
    """Run a command on the remote server and print output."""
    print(f"\n=== Remote: {cmd} ===", flush=True)
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USER, password=PASSWORD, timeout=30)
        stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout, get_pty=False)
        out = stdout.read().decode("utf-8", errors="replace")
        err = stderr.read().decode("utf-8", errors="replace")
        exit_code = stdout.channel.recv_exit_status()
        if out:
            print(out)
        if err:
            print(f"[stderr] {err}")
        print(f"[exit code: {exit_code}]")
        return exit_code, out, err
    finally:
        client.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 ssh-helper.py '<command>'")
        sys.exit(1)
    cmd = sys.argv[1]
    code, _, _ = run_remote(cmd)
    sys.exit(code)
